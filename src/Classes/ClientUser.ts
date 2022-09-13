import Client from "../Client";
import ConnectionManager from "../Managers/ConnectionManager";
import ClientPresence from "./Presence/ClientPresence";
import User from "./User";

export default class ClientUser extends User {
	public presence: ClientPresence;
	public connections: ConnectionManager;

	constructor(client: Client, data: any) {
		super(client, data.user);
		this.presence = new ClientPresence(this.client);
		this.connections = new ConnectionManager(this.client, data.connected_accounts);
	}
}
