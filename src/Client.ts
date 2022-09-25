import WebSocket from "ws";
import { EventEmitter, once } from "node:events";
import TypedEmitter from "typed-emitter";
import { apiFetch, genGatewayURL, fetch, wait } from "./utils";
import { APIFetchOptions, GatewayEventFormat, PresenceStatus } from "./Types";
import GatewayEvents from "./GatewayEvents";
import ClientUser from "./Classes/ClientUser";
import GuildManager from "./Managers/GuildManager";
import Logger from "./Logger";
import ClientEventHandler from "./ClientEventHandler";
import User from "./Classes/User";
import { Collection } from "@djs-user/utility";

/** A Discord.js User Client */
export default class Client extends (EventEmitter as new () => TypedEmitter<GatewayEvents>) {
	/** Options from the client creation */
	public options: ClientOptions;
	/** The login options passed for the client */
	public loginOptions: ClientLoginOptions;
	/** The client event handler */
	private ClientEventHandler: ClientEventHandler;
	/** Raw Data from the Ready Event */
	public readyData: any;
	/** The Logger for the client (Only works if debug is enabled) */
	public Logger: Logger;
	/**
	 * Whether the client was manually closed using `disconnect()`
	 * Used to make sure the client does not send the close event and reconnect
	 */
	private closed: boolean = false;
	/** Messages that failed to send due to Gateway Disconnections */
	private failed_packets: Collection<GatewayEventFormat> = new Collection<GatewayEventFormat>();

	/** The client compressor (zlib-sync or none `(data) => data`) */
	public compressor: {
		inflate?: any;
		decode: (...args: any[]) => any;
		enabled: boolean;
	} = {
		decode: (data: any) => data,
		enabled: false
	};
	/** The client encryptor (JSON or erlpack) */
	public encryptor: {
		pack: (...args: any) => any;
		unpack: (...args: any[]) => any;
		enabled: boolean;
	} = {
		pack: JSON.stringify,
		unpack: JSON.parse,
		enabled: false
	};
	/** The Client Data Encoder */
	public encode: (data: GatewayEventFormat) => any;
	/** The Client Data Decoder */
	public decode: (data: any) => GatewayEventFormat;

	/** The session data passed for the client */
	public sessionData: SessionData;
	/** Whether the client has recieved the ready evnt */
	private recievedReady: boolean = false;
	/** This client token */
	public token: string;
	/** The session id for the client */
	public session_id?: string;
	/** The websocket for the client*/
	private socket: WebSocket;
	/** The gateway url the client is using */
	public gatewayURL: string;
	/** The sequence number the client is on */
	public seq?: number = null;
	/** The client heartbeater */
	private beater: NodeJS.Timer;
	/** The client heartbeat interval */
	public heartbeat_interval: number;

	/** The User for the client */
	public user: ClientUser;
	/** Guilds the User is in */
	public guilds: GuildManager;
	/** All stored users in this client */
	public readonly users: Collection<User> = new Collection<User>();

	/**
	 * A Discord.js User Client
	 * @param options Options for making the client
	 */
	constructor(options: ClientOptions = {}) {
		super();
		this.options = options;
		this.Logger = new Logger(this.options.debug);
		this.removeAllListeners();
		this.setMaxListeners(25);
		this.setupParsing();
		this.ClientEventHandler = new ClientEventHandler(this);
	}

	/**
	 * Sends a message through the connection
	 * <warn>This must have all gateway message data bits sent, only use if you know what you're doing</warn>
	 * @param {GatewayEventFormat} data The data passed through
	 * @returns {Client} The Client
	 */
	public async sendMessage(data: GatewayEventFormat): Promise<Client> {
		if (this.socket.readyState == WebSocket.CLOSING || this.socket.readyState == WebSocket.CLOSED) {
			this.failed_packets.push(data);
			return this;
		}
		if (this.socket.readyState == WebSocket.CONNECTING) {
			await this.awaitEvent("open");
		}
		this.socket.send(this.encode(data), err => {
			if (err) this.Logger.error(err);
		});
		return this;
	}

	/** Setup the data parsing for the Gateway */
	private setupParsing() {
		try {
			const erlpack = require("erlpack");
			this.encryptor = {
				pack: erlpack.pack,
				unpack: (data: any): GatewayEventFormat => {
					if (!Buffer.isBuffer(data)) data = Buffer.from(new Uint8Array(data));
					return erlpack.unpack(data);
				},
				enabled: true
			};
		} catch {
			this.encryptor = {
				pack: JSON.stringify,
				unpack: (data: string): GatewayEventFormat => {
					if (typeof data !== "string") data = new TextDecoder().decode(data);
					return JSON.parse(data);
				},
				enabled: false
			};
		}

		try {
			const zlib = require("zlib-sync");
			this.compressor = {
				inflate: new zlib.Inflate({
					chunkSize: 65535,
					flush: zlib.Z_SYNC_FLUSH,
					to: this.encryptor.enabled ? "" : "string"
				}),
				decode: (data: any) => {
					const l = data.length;
					const flush = l >= 4 && data[l - 4] === 0x00 && data[l - 3] === 0x00 && data[l - 2] === 0xff && data[l - 1] === 0xff;
					this.compressor.inflate.push(data, flush && zlib.Z_SYNC_FLUSH);
					return this.compressor.inflate.result;
				},
				enabled: true
			};
		} catch {
			this.compressor = {
				decode: data => data,
				enabled: false
			};
		}

		this.encode = (data: GatewayEventFormat) => this.encryptor.pack(data);
		this.decode = (data: any) => this.encryptor.unpack(this.compressor.decode(data));

		this.Logger.log(`Compression ${this.compressor.enabled ? "Enabled" : "Disabled"}`);
		this.Logger.log(`Encryption ${this.encryptor.enabled ? "Enabled" : "Disabled"}`);
	}

	/**
	 * Log into the client
	 * @param {string} token The token for the client
	 * @param {SessionData} sessionData The session data for login
	 * @param {ClientLoginOptions} options The options for the login
	 * @returns {Client} The Client
	 */
	public async login(
		token: string,
		sessionData: SessionData = {
			client_state: {
				guild_hashes: {},
				highest_last_message_id: "0",
				read_state_version: 0,
				user_guild_settings_version: -1,
				user_settings_version: -1
			},
			properties: {
				os: "Windows",
				browser: "Discord Desktop",
				release_channel: "stable",
				system_locale: "en-US"
			},
			presence: {
				activities: [],
				afk: false,
				since: 0,
				status: "online"
			}
		},
		options: ClientLoginOptions = {}
	): Promise<Client> {
		if (!token) throw new Error("NO TOKEN SPECIFIED");

		this.loginOptions = options;

		if (!this.gatewayURL)
			this.gatewayURL = genGatewayURL((await fetch("https://discord.com/api/v10/gateway")).data.url, {
				v: "10",
				encoding: this.encryptor.enabled ? "etf" : "json",
				...(this.compressor.enabled ? { compress: "zlib-stream" } : {})
			});

		this.Logger.log("Gateway URL: " + this.gatewayURL);

		this.sessionData = sessionData;
		this.token = token;
		this.clearBeater();
		this.socket = new WebSocket(this.gatewayURL);

		this.socket.onopen = (openEvent: WebSocket.Event) => {
			this.closed = false;
			this.failed_packets.forEach(packet =>
				this.socket.send(this.encode(packet), err => {
					if (err) this.Logger.error(err);
				})
			);
			this.failed_packets.clear();
			this.emit("open", openEvent);
		};
		this.socket.onclose = (closeEvent: WebSocket.CloseEvent) => {
			this.Logger.warn(`Closed with Code: ${closeEvent.code} and Reason: ${closeEvent.reason}`);
			if (this.closed) return;
			else {
				this.closed = true;
			}
			this.emit("close", closeEvent);
			this.reconnect();
		};
		this.socket.onerror = async (error: WebSocket.ErrorEvent) => {
			this.Logger.error("\n\n\nGateway Error Recieved:\n\n", error, "\n\n\n");
			if (this.closed) return;
			else {
				this.closed = true;
			}
			this.emit("error", error);
			this.Logger.error("Error Recieved, Waiting 3 Seconds To Reconnect");
			await wait(3000);
			this.Logger.error("Reconnecting");
			this.reconnect();
		};

		this.socket.onmessage = async (event: WebSocket.MessageEvent) => {
			let data: GatewayEventFormat;
			try {
				data = this.decode(event.data);
			} catch (err) {
				return this.Logger.error("Encountered Error While Parsing Gateway Message:\n\n\n", event.data, "\n\n\n", err, "\n\n\n");
			}
			this.emit("message", data);

			if (data.s) this.seq = data.s;

			const knownOPs = [0, 1, 7, 9, 10, 11];
			if (!knownOPs.includes(data.op)) {
				this.Logger.log("\n\n\nRECIEVED UNKOWN OP\n");
				this.Logger.log(data);
				this.Logger.log("\n\n\n");
			} else if (data.op != 0 && data.op != 11) {
				this.Logger.log(data.op);
			}

			switch (data.op) {
				case 0: // Dispatch
					let eventData = data.d;

					if (data.t.toUpperCase() !== "READY" && this.recievedReady === false) await this.awaitEvent("ready");

					const handler = this.ClientEventHandler[data.t.toUpperCase()];

					if (handler) eventData = await handler.bind(this.ClientEventHandler)(data);

					if (eventData === null) break;
					if (eventData === undefined) eventData = data.d;

					if (data.t == "READY") {
						if (this.recievedReady) break;
						else {
							this.recievedReady = true;
							this.Logger.log("READY Event Received");
						}
					}
					this.emit(data.t.toLowerCase() as keyof GatewayEvents, eventData);
					break;
				case 1: // Request Heartbeat
					this.heartbeat();
					break;
				case 7: // Reconnect And Resume
					this.reconnect();
					break;
				case 9: // Invalid Session
					if (!data.d) {
						this.session_id = null;
					}
					this.identify();
					break;
				case 10: // Hello
					this.heartbeat_interval = data.d.heartbeat_interval;
					this.setupBeater();
					this.identify();
					break;
				case 11: // Heartbeat Acknowledge
					this.emit("heartbeatAck");
					break;
			}
		};

		return this;
	}

	/**
	 * Tell the gateway who you are
	 * @returns {Client} The Client
	 * @private
	 */
	private identify(): Client {
		this.Logger.log("Identify/Resume Function Called");
		if (this.session_id) {
			this.Logger.log("Sent Resume Call");
			this.sendMessage({
				op: 6,
				d: {
					token: this.token,
					session_id: this.session_id,
					seq: this.seq
				}
			});
		} else {
			this.seq = null;
			this.Logger.log("Sent Identify Call");
			this.sendMessage({
				op: 2,
				d: {
					token: this.token,
					capabilities: 509,
					compress: this.compressor.enabled,
					large_threshold: 250,
					...this.sessionData
				}
			});
		}

		return this;
	}

	/**
	 * Reconnect to the gateway with new or old data
	 * @param {string} token New token to reconnect with (null for current)
	 * @param {SessionData} sessionData New SessionData to reconnect with (null for current)
	 * @param {ClientLoginOptions} loginOptions New LoginOptions to reconnect with (null for current)
	 * @returns {Client} The Client
	 */
	public reconnect(token?: string, sessionData?: SessionData, loginOptions?: ClientLoginOptions): Client {
		this.clearBeater();
		this.socket = null;
		this.login(token || this.token, sessionData || this.sessionData, loginOptions || this.loginOptions);

		return this;
	}

	/**
	 * Clear the current heartbeater
	 * @returns {Client} The Client
	 * @private
	 */
	private clearBeater(): Client {
		this.heartbeat_interval = null;
		clearInterval(this.beater);
		this.beater = null;

		return this;
	}

	/**
	 * Sets up the heartbeater
	 * @returns {Client} The Client
	 * @private
	 */
	private setupBeater(): Client {
		if (!this.heartbeat_interval) return this;
		setTimeout(() => this.heartbeat(), 5000);
		this.beater = setInterval(() => this.heartbeat(), this.heartbeat_interval);
		return this;
	}

	/**
	 * Sends a heartbeat to the gateway
	 * @returns {Client} The Client
	 */
	public async heartbeat(): Promise<Client> {
		if (this.options.logHeartbeats) this.Logger.log("Sending Heartbeat");
		this.sendMessage({ op: 1, d: this.seq });
		this.emit("heartbeatSend");
		const recieved = await this.awaitEvent("heartbeatAck", 7500);
		if (recieved) {
			if (this.options.logHeartbeats) this.Logger.log("Recieved Heartbeat Ack");
			this.emit("heartbeatAck");
		} else {
			this.Logger.log("Failed To Recieve Heartbeat Ack");
			this.reconnect();
		}
		return this;
	}

	/**
	 * Sends a request to the discord api as the user
	 * (Implements rate limit handlers)
	 * @param {string} path The path for the fetch, ex: `https://discord.com/api/v10/${path}`
	 * @param {APIFetchOptions} data Data for the fetch
	 * @returns {Promise<any>} The response from the request
	 */
	public async apiFetch(path: string, data?: APIFetchOptions): Promise<any> {
		return await apiFetch(this.token, path, data);
	}

	/**
	 * Disconnects The Client
	 */
	public disconnect() {
		this.Logger.log("Disconnecting Due To `disconnect()` Function Being Called");
		this.closed = true;
		this.clearBeater();
		this.socket.close(1000);
		this.emit("disconnect");
	}

	/**
	 * Await a gateway message (With Typings)
	 * @param event The event
	 * @optional @param timeout A timeout for the await
	 * @returns The data from the event OR null if failed
	 */
	public async awaitEvent(event: keyof GatewayEvents, timeout?: number): Promise<any> {
		return await this.awaitRawEvent(event, timeout);
	}

	/**
	 * Await a gateway message (Without Typings)
	 * @param event The event
	 * @optional @param timeout A timeout for the await
	 * @returns The data from the event OR null if failed
	 */
	public async awaitRawEvent(event: string, timeout?: number): Promise<any> {
		const aborter = new AbortController();
		if (timeout) setTimeout(() => aborter.abort(`Hit Timeout Of ${timeout}ms`), timeout);
		try {
			return await once(this, event, { signal: aborter.signal });
		} catch {
			return null;
		}
	}

	/**
	 * Push a user to the cache
	 * @param {User} user The user to push
	 * @returns {User} The pushed user
	 */
	public pushUser(user: User): User {
		this.users.push(user);
		return user;
	}

	/**
	 * Create a client user (And push it)
	 * @param data The user data
	 * @returns {User} The created user
	 */
	public createUser(data: any): User {
		const user = new User(this, data);
		this.pushUser(user);
		return user;
	}

	/**
	 * Fetch a User from the API or from the Cache (And push it)
	 * @param id The user id
	 * @param force Set to `false` (or don't set) to allow checking through the cache before fetching from the API
	 * @returns {User} The user
	 */
	public async getUser(id: string, force: boolean = false): Promise<User> {
		if (!force) if (this.users.find(i => i.id == id)) return this.users.find(i => i.id == id);
		const data = await this.apiFetch(`/users/${id}`);
		const user = new User(this, data);
		this.pushUser(user);
		return user;
	}
}

/** Session Data for the client login */
export interface SessionData {
	client_state?: {
		guild_hashes?: Object;
		highest_last_message_id?: string;
		read_state_version?: number;
		user_guild_settings_version?: number;
		user_settings_version?: number;
	};
	properties: {
		browser: "Discord Desktop" | "Discord Android" | string;
		browser_user_agent?: string;
		client_build_number?: string;
		client_event_source?: unknown;
		client_version?: string;
		browser_version?: string;
		device?: string;
		device_id?: string;
		distro?: string;
		os: "Windows" | "Linux" | "OSX" | "iOS" | "Android" | string;
		os_arch?: string;
		os_version?: string;
		referrer?: string;
		referrer_current?: string;
		referring_domain?: string;
		referring_domain_current?: string;
		release_channel?: string;
		window_manager?: string;
		system_locale?: string;
	};
	presence?: {
		activities: object[];
		afk: boolean;
		since: number;
		status: PresenceStatus;
	};
}

/** Options for the client login */
export interface ClientLoginOptions {}

/** Options for the client constructor */
export interface ClientOptions {
	/** Enable Debug Logging */
	debug?: boolean;
	/**
	 * Enable logging for heartbeats and heartbeat acks
	 * (ONLY WORKS WITH `debug` ENABLED)
	 */
	logHeartbeats?: boolean;
}
