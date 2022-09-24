import Guild from "../Classes/Guild";
import GuildMember from "../Classes/GuildMember";
import User from "../Classes/User";
import Client from "../Client";

class GuildMemberManager {
	public client: Client;
	public guild: Guild;

	public cache: Array<GuildMember> = [];

	constructor(client: Client, guild: Guild, data?: any) {
		this.client = client;
		this.guild = guild;
		if (data) this.pushToCache(data);
	}

	public async fetch(IDs: string[] | string): Promise<GuildMember[]> {
		if (!IDs) return [];
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
			if (this.cache.find(i => i.id == member.id)) {
				this.cache[this.cache.indexOf(this.cache.find(i => i.id == member.id))] = member;
			} else {
				this.cache.push(member);
			}
		}

		return this.cache.filter(i => i.id == IDs || IDs.includes(i.id));
	}

	public pushToCache(members: GuildMember | GuildMember[]): GuildMember[] {
		if (!Array.isArray(members)) members = [members];
		for (const member of members) {
			if (this.cache.find(i => i.id == member.id)) {
				this.cache[this.cache.indexOf(this.cache.find(i => i.id == member.id))] = member;
			} else {
				this.cache.push(member);
			}
		}
		return this.cache;
	}

	public removeFromCache(users: User | User[]): GuildMember[] {
		if (!Array.isArray(users)) users = [users];
		let removed: GuildMember[] = [];
		for (const user of users) {
			const userInCache = this.cache.find(i => i.id == user.id);
			if (!userInCache) continue;
			this.cache.splice(this.cache.indexOf(userInCache), 1);
			removed.push(userInCache);
		}
		return removed;
	}
}

export default GuildMemberManager;
