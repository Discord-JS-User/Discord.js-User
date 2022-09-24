import Guild from "../Classes/Guild";
import Client from "../Client";
import Role from "../Classes/Role";

class RoleManager {
	public client: Client;
	public guild: Guild;

	public cache: Array<Role> = [];

	constructor(client: Client, guild: Guild, roles: Array<any>) {
		this.client = client;
		this.guild = guild;
		this.cache = roles.map((r: any) => new Role(this.client, this.guild, r));
	}

	public async fetch(id?: string) {
		let data = await this.client.apiFetch(`/guilds/${this.guild.id}/roles`);
		if (!data) return null;
		data = data.map((r: any) => new Role(this.client, this.guild, r));
		this.cache = data;
		return id ? data.find((r: Role) => r.id == id) : data;
	}

	public push(role: Role) {
		if (this.cache.find(i => i.id == role.id)) {
			this.cache[this.cache.indexOf(this.cache.find(i => i.id == role.id))] = role;
		} else {
			this.cache.push(role);
		}
		return role;
	}

	public remove(role: Role) {
		const foundRole = this.cache.find(i => i.id == role.id);
		if (!foundRole) return role;
		return this.cache.splice(this.cache.indexOf(foundRole), 1)[0];
	}
}

export default RoleManager;
