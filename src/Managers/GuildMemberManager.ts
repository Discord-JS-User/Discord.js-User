import Guild from "../Classes/Guild";
import GuildMember from "../Classes/GuildMember";
import User from "../Classes/User";
import Client from "../Client";
import { Collection } from "@discord.js-user/utility";

class GuildMemberManager {
	public client: Client;
	public guild: Guild;

	public readonly cache: Collection<GuildMember> = new Collection<GuildMember>();

	constructor(client: Client, guild: Guild, data?: any) {
		this.client = client;
		this.guild = guild;
		if (data) this.pushToCache(data);
	}

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

	public pushToCache(members: GuildMember | GuildMember[]): Collection<GuildMember> {
		if (!Array.isArray(members)) members = [members];
		for (const member of members) {
			this.cache.push(member);
		}
		return this.cache;
	}

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
