import Client from "../Client";
import ClientUserPresence from "./Presence/ClientUserPresence";
import SessionManager from "../Managers/SessionManager";
import UserSettings from "./ClientUser/UserSettings";
import { ConnectionManager } from "../Managers/MiniManagers";
import UserGuildSettings from "./ClientUser/UserGuildSettings";
import { DiscordNitroLevel } from "../Types";
import { fillClassValues } from "../utils";

/** A User For The Client, Coming With Extra Properties And Methods */
export default class ClientUser {
	/** The Raw Client User Data */
	public raw: any;

	/** The Client */
	public client: Client;

	/** The User ID */
	public id: string;
	/** The User Username */
	public username: string;
	/** The User Discriminator (4-Digit Discord Tag) */
	public discriminator: string;
	/** The User's Avatar Hash */
	public avatar?: string;
	/** Whether the User is a Bot */
	public bot: boolean;
	/** Whether the User is an Official Discord System Bot */
	public system: boolean;
	/** Whether the User has 2FA enabled */
	public mfa?: boolean;
	/** The User's Banner Hash */
	public banner?: string;
	/** The User's Accent Color */
	public accent_color?: number;
	/** THe User's chosen language */
	public locale?: string;
	/** Whether the User's email has been verified */
	public verified?: boolean;
	/** The User's email */
	public email?: string;
	/** The flags on the User's account */
	public flags?: number;
	/** The public flags on the User's account */
	public public_flags?: number;
	/** The level of Discord Nitro the user has */
	public nitro_level: DiscordNitroLevel;
	/** The User's Bio */
	public bio: string;
	/** The User's Banner Color */
	public banner_color?: string;
	public avatar_decoration?: unknown;
	public purchased_flags: number;
	/** The User Phone NUmber */
	public phone: string;
	/** Whether the User is allowed to view NSFW content */
	public nsfw_allowed: boolean;
	public mobile: boolean;
	public desktop: boolean;

	/** The User Presence */
	public presence: ClientUserPresence;
	/** The User Connections */
	public connections: ConnectionManager;
	/** The User Sessions */
	public sessions: SessionManager;
	/** The User Settings */
	public settings: UserSettings;
	/** The User Guild Settings */
	public guild_settings: UserGuildSettings;

	/**
	 * A User
	 * @param client The Client
	 * @param data Data to fill
	 */
	constructor(client: Client, data: any) {
		this.client = client;
		this.setup(data);

		this.presence = new ClientUserPresence(this.client);
		this.connections = new ConnectionManager(this.client, data.connected_accounts);
		this.sessions = new SessionManager(this.client, data.sessions);
		this.settings = new UserSettings(this.client, data.user_settings);
		this.guild_settings = new UserGuildSettings(this.client, data.user_guild_settings);
	}

	private setup(data: any) {
		const aliases = {
			nitro_type: "premium_type",
			mfa: "mfa_enabled"
		};
		const parsers = {
			bot: i => !!i,
			system: i => !!i,
			nitro_level: i => i || 0
		};
		fillClassValues(this, data, aliases, parsers);
		this.raw = data;
	}
}
