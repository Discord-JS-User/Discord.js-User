import Client from "../Client";
import ClientPresence from "./ClientUser/ClientUserPresence";
import User from "./User";
import SessionManager from "../Managers/SessionManager";
import UserSettings from "./ClientUser/UserSettings";
import { ConnectionManager } from "../Managers/MiniManagers";

/** A User For The Client, Coming With Extra Properties And Methods */
export default class ClientUser extends User {
	/** The Raw Client User Data */
	public raw: any;

	/** The User Presence */
	public presence: ClientPresence;
	/** The User Connections */
	public connections: ConnectionManager;
	/** The User Sessions */
	public sessions: SessionManager;
	/** The User Settings */
	public settings: UserSettings;

	public purchased_flags: number;
	/** The User Phone NUmber */
	public phone: string;
	/** Whether the User is allowed to view NSFW content */
	public nsfw_allowed: boolean;
	public mobile: boolean;
	public desktop: boolean;

	/**
	 * A User For The Client, Coming With Extra Properties And Methods
	 * @param client The Client
	 * @param data Data to fill
	 */
	constructor(client: Client, data: any) {
		super(client, data.user);

		this.purchased_flags = data.purchased_flags;
		this.phone = data.phone;
		this.nsfw_allowed = data.nsfw_allowed;
		this.mobile = data.mobile;
		this.desktop = data.desktop;

		this.raw = data;
		this.presence = new ClientPresence(this.client);
		this.connections = new ConnectionManager(this.client, data.connected_accounts);
		this.sessions = new SessionManager(this.client, data.sessions);
		this.settings = new UserSettings(this.client, data.user_settings);
	}
}
