import WebSocket from "ws";
import { EventEmitter } from "node:events";
import TypedEmitter from "./Native Modules/TypedEmitter";
import { apiFetch, genGatewayURL } from "./utils";
import { APIFetchOptions, ClientLoginOptions, GatewayEventFormat, SessionData, ClientOptions } from "./Types";
import GatewayEvents from "./GatewayEvents";
import ClientUser from "./Classes/ClientUser";
import ClientMemberListManager from "./AppElements/MemberList/ClientMemberListManager";
import GuildManager from "./Managers/GuildManager";
import Logger from "./Logger";

/**
 * The Client Object
 * @extends {EventEmitter}
 */
class Client extends (EventEmitter as new () => TypedEmitter<GatewayEvents>) {
	/**
	 * Options from the client creation
	 */
	public options: ClientOptions;
	/**
	 * Raw Data from the Ready Event
	 */
	public readyData: any;
	/**
	 * The Logger for the client
	 * (Only works if debug is enabled)
	 */
	public Logger: Logger;
	/**
	 * Whether the client was manually closed using `disconnect()`
	 * Used to make sure the client does not send the close event and reconnect
	 */
	private closed: boolean = false;

	// Client Options

	/**
	 * The login options passed for the client
	 */
	public loginOptions: ClientLoginOptions;

	/**
	 * The client compressor (zlib-sync or none `(data) => data`)
	 */
	public compressor: {
		inflate?: any;
		func: (...args: any[]) => any;
		enabled: boolean;
	} = {
		func: (data: any) => data,
		enabled: false
	};
	/**
	 * The client encryptor (JSON or erlpack)
	 */
	public encryptor: {
		pack: (...args: any) => any;
		unpack: (...args: any[]) => any;
		enabled: boolean;
	} = {
		pack: JSON.stringify,
		unpack: JSON.parse,
		enabled: false
	};

	/**
	 * The Client Data Encoder
	 */
	public encode: (data: GatewayEventFormat) => any;
	/**
	 * The Client Data Decoder
	 */
	public decode: (data: any) => GatewayEventFormat;

	// Gateway Items
	/**
	 * The session data passed for the client
	 */
	public sessionData: SessionData;
	/**
	 * Whether the client has recieved the ready evnt
	 */
	private recievedReady: boolean = false;
	/**
	 * This client token
	 */
	public token: string;
	/**
	 * The session id for the client
	 */
	public session_id?: string;
	/**
	 * The websocket for the client
	 */
	private socket: WebSocket;
	/**
	 * The gateway url the client is using
	 * @type {string}
	 */
	public gatewayURL: string;
	/**
	 * The sequence number the client is on
	 * @type {number}
	 */
	public seq?: number = null;
	/**
	 * The client heartbeater
	 */
	private beater: NodeJS.Timer;
	/**
	 * The client heartbeat interval
	 */
	public heartbeat_interval: number;
	/**
	 * The timestamp of the last heartbeat sent by the client
	 */
	public last_heartbeat: number = 0;
	/**
	 * The timestamp of the last heartbeat ack recieved by the client
	 */
	public last_heartbeat_ack: number = 0;

	// User Items
	/**
	 * The User for the client
	 */
	public user: ClientUser;
	/**
	 * The MemberListManager for the client
	 */
	public memberList: ClientMemberListManager;
	/**
	 * Guilds the User is in
	 */
	public guilds: GuildManager;

	/**
	 * Create the client
	 */
	constructor(options: ClientOptions = {}) {
		super();
		this.options = options;
		this.Logger = new Logger(this.options.debug);
		this.removeAllListeners();
		this.setMaxListeners(25);
		this.setupParsing();
	}

	/**
	 * Sends a message through the connection
	 * <warn>This must have all gateway message data bits sent, only use if you know what you're doing</warn>
	 * @param {GatewayEventFormat} data The data passed through
	 * @returns {Client} The Client
	 */
	public async sendMessage(data: GatewayEventFormat): Promise<Client> {
		if (this.socket.readyState == WebSocket.CLOSING || this.socket.readyState == WebSocket.CLOSED) return this;
		if (this.socket.readyState == WebSocket.CONNECTING) {
			await new Promise(res => {
				const IntervalID = setTimeout(() => {
					if (this.socket.readyState === WebSocket.OPEN) {
						clearInterval(IntervalID);
						res(void null);
					}
				});
			});
		}
		this.socket.send(this.encode(data), err => {
			if (err) this.Logger.error(err);
		});
		return this;
	}

	/**
	 * Setup the data parsing for the Gateway
	 */
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
			const inflate = new zlib.Inflate({
				chunkSize: 65535,
				flush: zlib.Z_SYNC_FLUSH,
				to: this.encryptor.enabled ? "" : "string"
			});
			this.compressor = {
				inflate: inflate,
				func: (data: any) => {
					const l = data.length;
					this.compressor.inflate.push(data, l >= 4 && data[l - 4] === 0x00 && data[l - 3] === 0x00 && data[l - 2] === 0xff && data[l - 1] === 0xff && zlib.Z_SYNC_FLUSH);
					return this.compressor.inflate.result;
				},
				enabled: true
			};
		} catch {
			this.compressor = {
				func: data => data,
				enabled: false
			};
		}

		this.encode = (data: GatewayEventFormat) => this.encryptor.pack(data);
		this.decode = (data: any) => this.encryptor.unpack(this.compressor.func(data));

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
	public login(
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
	): Client {
		if (!token) throw new Error("NO TOKEN SPECIFIED");

		this.loginOptions = options;

		this.gatewayURL = genGatewayURL("wss://gateway.discord.gg", {
			v: "10",
			encoding: this.encryptor.enabled ? "etf" : "json",
			...(this.compressor.enabled ? { compress: "zlib-stream" } : {})
		});

		this.Logger.log("Gateway URL: " + this.gatewayURL);

		this.sessionData = sessionData;
		this.token = token;
		this.socket = new WebSocket(this.gatewayURL);

		this.socket.onopen = (openEvent: WebSocket.Event) => {
			this.closed = false;
			this.emit("open", openEvent);
		};
		this.socket.onclose = (closeEvent: WebSocket.CloseEvent) => {
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
			await new Promise(res => setTimeout(res, 3000));
			this.Logger.error("Reconnecting");
			this.reconnect();
		};

		this.socket.onmessage = async (event: WebSocket.MessageEvent) => {
			const data: GatewayEventFormat = this.decode(event.data);
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

					switch (data.t.toUpperCase()) {
						case "READY":
							this.readyData = data.d;
							this.user = new ClientUser(this, data.d);
							this.session_id = data.d.session_id;
							this.gatewayURL = data.d.resume_gateway_url;
							this.memberList = new ClientMemberListManager(this);
							this.guilds = new GuildManager(this, data.d.guilds);
							for (const guild of this.guilds.cache) {
								await guild.channels.fetch();
							}
							break;
						case "RESUMED":
							this.Logger.log("Resumed Successfully");
							break;
						case "GUILD_MEMBER_LIST_UPDATE":
							eventData = [];
							for (var op of data.d.ops) {
								op.guild_id = data.d.guild_id;
								op.id = data.d.id;
								if (this.memberList[op.op.toLowerCase()]) {
									await this.memberList[op.op.toLowerCase()](op);
									eventData.push(...this.memberList.guilds.find(i => i.id == op.guild_id).channels.filter(i => i.list_id == op.id));
								}
							}
							break;
						case "SESSIONS_REPLACE":
							eventData = this.user.sessions._update(data.d);
							break;
					}

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
					this.last_heartbeat_ack = Date.now();
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
					compress: false,
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
	public heartbeat(): Client {
		this.Logger.log("Sending Heartbeat");
		this.sendMessage({ op: 1, d: this.seq });
		this.last_heartbeat = Date.now();
		setTimeout(() => {
			if (this.closed) return;
			if (this.last_heartbeat > this.last_heartbeat_ack) {
				this.Logger.log("Failed To Recieve Heartbeat Ack");
				this.reconnect();
			} else {
				this.Logger.log("Recieved Heartbeat Ack");
			}
		}, 5000);

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
}

export default Client;
