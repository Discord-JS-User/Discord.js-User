import Client from "../Client";
import ConnectionManager from "../Managers/ConnectionManager";
import ClientPresence from "./Presence/ClientPresence";
import User from "./User";
import SessionManager from "../Managers/SessionManager";
import UserSettings from "./ClientUser/UserSettings";

export default class ClientUser extends User {
	public raw: any;

	public presence: ClientPresence;
	public connections: ConnectionManager;
	public sessions: SessionManager;
	public settings: UserSettings;

	constructor(client: Client, data: any) {
		super(client, data.user);
		this.raw = data;
		this.presence = new ClientPresence(this.client);
		this.connections = new ConnectionManager(this.client, data.connected_accounts);
		this.sessions = new SessionManager(this.client, data.sessions);
		this.settings = new UserSettings(this.client, data.user_settings);
	}
}
