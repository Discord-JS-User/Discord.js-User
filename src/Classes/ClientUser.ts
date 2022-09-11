import Client from "../Client";
import ClientPresence from "./Presence/ClientPresence";
import User from "./User";

export default class ClientUser extends User {
	public presence: ClientPresence;

	constructor(client: Client, data: any) {
		super(client, data);
		this.presence = new ClientPresence(this.client);
	}
}
