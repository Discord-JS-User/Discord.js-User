import Guild from "../Classes/Guild";
import Client from "../Client";

class GuildManager {
	public client: Client;

	public cache: Array<Guild> = [];

	constructor(client: Client, guilds: Array<any>) {
		this.client = client;
		this.cache = guilds.map(g => new Guild(this.client, g));
	}

	public async fetch(id: string, force: boolean = false) {
		if (!force) {
			if (this.cache.find(i => i.id == id)) return this.cache.find(i => i.id == id);
		}
		const data = await this.client.apiFetch(`/guilds/${id}`, {
			queryParams: ["with_counts=true"]
		});
		const guild = new Guild(this.client, data);

		if (this.cache.find(i => i.id == id)) {
			this.cache[this.cache.indexOf(this.cache.find(i => i.id == id))] = guild;
		} else {
			this.cache.push(guild);
		}

		return guild;
	}
}

export default GuildManager;
