import Client from "../Client";
import ClientPresence from "./ClientUser/ClientUserPresence";
import User from "./User";
import SessionManager from "../Managers/SessionManager";
import UserSettings from "./ClientUser/UserSettings";
import { ConnectionManager } from "../Managers/MiniManagers";

export default class ClientUser extends User {
	public raw: any;

	public presence: ClientPresence;
	public connections: ConnectionManager;
	public sessions: SessionManager;
	public settings: UserSettings;

	public purchased_flags: number;
	public phone: string;
	public nsfw_allowed: boolean;
	public mobile: boolean;
	public desktop: boolean;

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
