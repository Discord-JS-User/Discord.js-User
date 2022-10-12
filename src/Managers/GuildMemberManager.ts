import Guild from "../Classes/Guild";
import GuildMember from "../Classes/GuildMember";
import User from "../Classes/User";
import Client from "../Client";
import { Collection } from "@djs-user/collection";
import BaseManager from "../BaseClasses/BaseManager";

/** A Manager for Guild Members */
class GuildMemberManager extends BaseManager<GuildMember> {
	/** The Guild */
	public guild: Guild;

	/**
	 * A Manager for Guild Members
	 * @param client The Client
	 * @param guild The Guild
	 * @param data Data to push (if you have it)
	 */
	constructor(client: Client, guild: Guild, data?: any) {
		super(client);
		this.guild = guild;
		if (data) this.pushToCache(data);
	}

	/**
	 * Fetch a single member
	 * @param id The member ID
	 * @param force Whether to force the fetch or to check the cache first (defaults to checking cache)
	 * @returns The fetched Member
	 */
	public async fetchSingle(id: string, force: boolean = false): Promise<GuildMember> {
		if (!id || typeof id != "string") throw new TypeError(`ID Value (\`${id}\`) Is Not A String`);
		if (!force) {
			if (this.cache.find(i => i.id == id)) return this.cache.find(i => i.id == id);
		}
		return (await this.fetch([id])).get(id);
	}

	/**
	 * Fetch one or more Guild Member
	 * @param IDs The IDs to fetch (singular or an array)
	 * @returns A Collection of the fetched members
	 */
	public async fetch(IDs: string[] | string): Promise<Collection<GuildMember>> {
		if (!IDs) return new Collection<GuildMember>();
		if (!Array.isArray(IDs)) IDs = [IDs];
		const nonce = (Date.now() - Math.floor(Math.random() * 500_000_000_000)).toString();

		this.client.sendMessage({
			op: 8,
			d: {
				guild_id: [this.guild.id],
				presences: true,
				user_ids: IDs,
				nonce
			}
		});

		let data = [];

		let waitForChunks = 1;

		while (waitForChunks > 0) {
			const pushing = await this.client.awaitRawEvent("guild_members_chunk");
			if (pushing[0].nonce != nonce) continue;
			data.push(...pushing);
			waitForChunks = pushing[0].chunk_count - data.length;
		}

		let members: GuildMember[] = [];

		for (const chunk of data) {
			members.push(
				...chunk.members.map(i => {
					i.presence = chunk.presences.find(f => f.user.id == i.user.id) || {
						status: "offline"
					};
					return new GuildMember(this.client, this.guild, i);
				})
			);
		}

		for (const member of members) {
			this.cache.push(member);
		}

		return this.cache.filter(i => i.id == IDs || IDs.includes(i.id));
	}

	/**
	 * Push members to the cache
	 * @param members The members to push (singular or an array)
	 * @returns The updated cache
	 */
	public pushToCache(members: GuildMember | GuildMember[]): Collection<GuildMember> {
		if (!Array.isArray(members)) members = [members];
		for (const member of members) {
			this.cache.push(member);
		}
		return this.cache;
	}

	/**
	 * Remove members from the cache
	 * @param users The members to remove (NOTE: Only pass the user objects of the members)
	 * @returns The removed members (as GuildMember Objects)
	 */
	public removeFromCache(users: User | User[]): GuildMember[] {
		if (!Array.isArray(users)) users = [users];
		let removed: GuildMember[] = [];
		for (const user of users) {
			const memberInCache = this.cache.find(i => i.id == user.id);
			if (!memberInCache) continue;
			this.cache.remove(memberInCache);
			removed.push(memberInCache);
		}
		return removed;
	}
}

export default GuildMemberManager;
