import Guild from "../Classes/Guild";
import Client from "../Client";
import Role from "../Classes/Role";
import { Collection } from "@djs-user/utility";
import BaseManager from "../BaseClasses/BaseManager";

/** A Manager for Guild Roles */
class RoleManager extends BaseManager<Role> {
	/** The Guild */
	public guild: Guild;

	/**
	 * A Manager for Guild Roles
	 * @param client The Client
	 * @param guild The Guild
	 * @param roles The Roles
	 */
	constructor(client: Client, guild: Guild, roles: Array<any>) {
		super(client);
		this.guild = guild;
		this.cache.push(...roles.map((r: any) => new Role(this.client, this.guild, r)));
	}

	/**
	 * Fetch and Update the cache
	 * @param id The ID of the role to fetch
	 * @returns The updated cache OR the Role that matches the specified ID if one is specified
	 */
	public async fetch(id?: string) {
		let data = await this.client.apiFetch(`/guilds/${this.guild.id}/roles`);
		if (!data) return null;
		data = data.map((r: any) => new Role(this.client, this.guild, r));
		this.cache = new Collection<Role>(data);
		return id ? data.find((r: Role) => r.id == id) : data;
	}

	/**
	 * Push a Role to the cache
	 * @param role The Role to push
	 * @returns The pushed Role
	 */
	public push(role: Role) {
		this.cache.push(role);
		return role;
	}

	/**
	 * Remove a Role from the cache
	 * @param role The Role to remove
	 * @returns The removed Role
	 */
	public remove(role: Role) {
		const foundRole = this.cache.find(i => i.id == role.id);
		if (!foundRole) return role;
		this.cache.remove(foundRole);
		return foundRole;
	}
}

export default RoleManager;
