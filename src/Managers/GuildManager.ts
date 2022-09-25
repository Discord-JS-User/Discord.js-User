import BaseManager from "../BaseClasses/BaseManager";
import Guild from "../Classes/Guild";
import Client from "../Client";

/** A Manager for Client Guilds */
class GuildManager extends BaseManager<Guild> {
	/**
	 * A Manager for Client Guilds
	 * @param client The Client
	 * @param guilds The Guilds (Raw Data Array)
	 */
	constructor(client: Client, guilds: Array<any>) {
		super(client);
		this.cache.push(...guilds.map(g => new Guild(this.client, g)));
	}

	/**
	 * Fetch a specific guild and update it
	 * @param id The guild to fetch
	 * @param force Whether to force the fetch, or check the cache first (defaults to checking cache first)
	 * @returns The fetched guild (as a Guild Object)
	 */
	public async fetch(id: string, force: boolean = false) {
		if (!id || typeof id != "string") throw new TypeError(`ID Value (\`${id}\`) Is Not A String`);
		if (!force) {
			if (this.cache.find(i => i.id == id)) return this.cache.find(i => i.id == id);
		}
		const data = await this.client.apiFetch(`/guilds/${id}`, {
			queryParams: ["with_counts=true"]
		});
		return this.push(data);
	}

	/**
	 * Push a guild to the cache
	 * @param data The guild data (raw)
	 * @returns The pushed guild (as a Guild Object)
	 */
	public push(data: any) {
		const guild = new Guild(this.client, data);
		this.cache.push(guild);
		return guild;
	}

	/**
	 * Remove a guild from the cache
	 * @param guild The guild to remove
	 * @returns The removed guild
	 */
	public remove(guild: any) {
		const foundGuild = this.cache.find(i => i.id == guild.id);
		if (!foundGuild) return guild;
		this.cache.remove(foundGuild);
		return foundGuild;
	}
}

export default GuildManager;
