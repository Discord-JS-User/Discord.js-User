import Guild from "../Classes/Guild";
import Client from "../Client";
import Role from "../Classes/Role";
import { Collection } from "@discord.js-user/utility";

class RoleManager {
	public client: Client;
	public guild: Guild;

	public cache: Collection<Role> = new Collection<Role>();

	constructor(client: Client, guild: Guild, roles: Array<any>) {
		this.client = client;
		this.guild = guild;
		this.cache.push(...roles.map((r: any) => new Role(this.client, this.guild, r)));
	}

	public async fetch(id?: string) {
		let data = await this.client.apiFetch(`/guilds/${this.guild.id}/roles`);
		if (!data) return null;
		data = data.map((r: any) => new Role(this.client, this.guild, r));
		this.cache = new Collection<Role>(data);
		return id ? data.find((r: Role) => r.id == id) : data;
	}

	public push(role: Role) {
		this.cache.push(role);
		return role;
	}

	public remove(role: Role) {
		const foundRole = this.cache.find(i => i.id == role.id);
		if (!foundRole) return role;
		this.cache.remove(foundRole);
		return foundRole;
	}
}

export default RoleManager;
