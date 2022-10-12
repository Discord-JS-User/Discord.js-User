import Connection from "../Classes/ClientUser/Connection";
import Guild from "../Classes/Guild";
import Client from "../Client";
import { BanObject } from "../Types";
import { Collection } from "@djs-user/collection";
import BaseManager from "../BaseClasses/BaseManager";

/** A Manager for Guild Bans */
export class BanManager extends BaseManager<BanObject> {
	/** The Guild */
	public guild: Guild;

	/**
	 * A Manager for Guild Bans
	 * @param client The Client
	 * @param guild The Guild
	 */
	constructor(client: Client, guild: Guild) {
		super(client);
		this.guild = guild;
	}

	/**
	 * Fetch and Update the Bans cache
	 * @returns The updated cache
	 */
	public async fetch() {
		this.cache = new Collection<BanObject>(
			(await this.client.apiFetch(`/guilds/${this.guild.id}/bans`)).map(ban => {
				ban.user = this.client.createUser(ban.user);
				return ban as BanObject;
			})
		);
		return this.cache;
	}

	/**
	 * Push a Ban to the cache
	 * @param data The Ban to push
	 * @returns The pushed Ban
	 */
	public push(data: BanObject) {
		this.cache.push(data);
		return data;
	}

	/**
	 * Remove a Ban from the cache
	 * @param data The Ban to remove
	 * @returns The removed Ban
	 */
	public remove(data: BanObject) {
		const item = this.cache.find(i => i.user.id == data.user.id);
		if (!item) return;
		this.cache.remove(item);
		return item;
	}
}

/** A Manager for Client Connections */
export class ConnectionManager extends BaseManager<Connection> {
	/**
	 * A Manager for Client Connections
	 * @param client The Client
	 * @param connections The Connections
	 */
	constructor(client: Client, connections: any[]) {
		super(client);
		this.cache.push(...connections.map(i => new Connection(this.client, i)));
	}

	/**
	 * Fetch and Update the cache
	 * @returns The updated cache
	 */
	public async fetch() {
		this.cache = new Collection<Connection>((await this.client.apiFetch("/users/@me/connections")).map(i => new Connection(this.client, i)));
		return this.cache;
	}

	/**
	 * Find a Connection Using a Query
	 * @param param0 The Query
	 * @returns The Found Connection
	 */
	public find({ id, name, type }: { id?: string; name?: string; type?: string | number }) {
		return this.cache.find(i => i.id === id || i.name === name || i.type == type);
	}

	/**
	 * Find multiple Connections Using a Query
	 * @param param0 The Query
	 * @returns The Found Connections
	 */
	public filter({ id, name, type }: { id?: string; name?: string; type?: string | number }) {
		return this.cache.filter(i => i.id === id || i.name === name || i.type == type);
	}
}
