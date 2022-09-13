import Connection from "../Classes/ClientUser/Connection";
import Client from "../Client";

export default class ConnectionManager {
	public client: Client;

	public cache: Connection[] = [];

	constructor(client: Client, connections: any[]) {
		this.client = client;
		this.cache = connections.map(i => new Connection(this.client, i));
	}

	public async fetch() {
		this.cache = (await this.client.apiFetch("/users/@me/connections")).map(i => new Connection(this.client, i));
		return this.cache;
	}

	public find({ id, name, type }: { id?: string; name?: string; type?: string | number }) {
		return this.cache.find(i => i.id === id || i.name === name || i.type == type);
	}

	public filter({ id, name, type }: { id?: string; name?: string; type?: string | number }) {
		return this.cache.filter(i => i.id === id || i.name === name || i.type == type);
	}
}
