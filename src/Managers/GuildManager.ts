import Guild from "../Classes/Guild";
import Client from "../Client";
import { Collection } from "@discord.js-user/utility";

class GuildManager {
	public client: Client;

	public readonly cache: Collection<Guild> = new Collection<Guild>();

	constructor(client: Client, guilds: Array<any>) {
		this.client = client;
		this.cache.push(...guilds.map(g => new Guild(this.client, g)));
	}

	public async fetch(id: string, force: boolean = false) {
		if (!force) {
			if (this.cache.find(i => i.id == id)) return this.cache.find(i => i.id == id);
		}
		const data = await this.client.apiFetch(`/guilds/${id}`, {
			queryParams: ["with_counts=true"]
		});
		return this.push(data);
	}

	public push(data: any) {
		const guild = new Guild(this.client, data);
		this.cache.push(guild);
		return guild;
	}

	public remove(guild: any) {
		const foundGuild = this.cache.find(i => i.id == guild.id);
		if (!foundGuild) return guild;
		this.cache.remove(foundGuild);
		return foundGuild;
	}
}

export default GuildManager;
