import Connection from "../Classes/ClientUser/Connection";
import Guild from "../Classes/Guild";
import Client from "../Client";
import { BanObject } from "../Types";
import { Collection } from "@discord.js-user/utility";

export class BanManager {
	public client: Client;
	public guild: Guild;

	public cache: Collection<BanObject> = new Collection<BanObject>();

	constructor(client: Client, guild: Guild) {
		this.client = client;
		this.guild = guild;
	}

	public async fetch() {
		this.cache = new Collection<BanObject>(
			(await this.client.apiFetch(`/guilds/${this.guild.id}/bans`)).map(ban => {
				ban.user = this.client.createUser(ban.user);
				return ban as BanObject;
			})
		);
		return this.cache;
	}

	public push(data: BanObject) {
		this.cache.push(data);
		return data;
	}

	public remove(data: BanObject) {
		const item = this.cache.find(i => i.user.id == data.user.id);
		if (!item) return;
		this.cache.remove(item);
		return item;
	}
}

export class ConnectionManager {
	public client: Client;

	public cache: Collection<Connection> = new Collection<Connection>();

	constructor(client: Client, connections: any[]) {
		this.client = client;
		this.cache.push(...connections.map(i => new Connection(this.client, i)));
	}

	public async fetch() {
		this.cache = new Collection<Connection>((await this.client.apiFetch("/users/@me/connections")).map(i => new Connection(this.client, i)));
		return this.cache;
	}

	public find({ id, name, type }: { id?: string; name?: string; type?: string | number }) {
		return this.cache.find(i => i.id === id || i.name === name || i.type == type);
	}

	public filter({ id, name, type }: { id?: string; name?: string; type?: string | number }) {
		return this.cache.filter(i => i.id === id || i.name === name || i.type == type);
	}
}
