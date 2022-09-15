import Session from "../Classes/ClientUser/Session";
import Client from "../Client";

export default class SessionManager {
	public client: Client;

	public cache: Session[];

	constructor(client: Client, data: any) {
		this.client = client;

		this.cache = data.map(i => new Session(this.client, i));
	}

	public _update(data: any): Session[] {
		this.cache = data.map(i => new Session(this.client, i));
		return this.cache;
	}
}
