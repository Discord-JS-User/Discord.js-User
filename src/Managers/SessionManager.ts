import Session from "../Classes/ClientUser/Session";
import Client from "../Client";
import { Collection } from "@discord.js-user/utility";

export default class SessionManager {
	public client: Client;

	public cache: Collection<Session> = new Collection<Session>();

	constructor(client: Client, data: any) {
		this.client = client;

		this.cache.push(...data.map(i => new Session(this.client, i)));
	}

	public _update(data: any[]): Collection<Session> {
		this.cache = new Collection<Session>(data.map(i => new Session(this.client, i)));
		return this.cache;
	}
}
