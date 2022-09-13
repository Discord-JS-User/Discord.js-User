import Client from "../Client";
import { fillClassValues } from "../utils";
import Guild from "./Guild";
import GuildMemberPresence from "./Presence/GuildMemberPresence";
import Role from "./Role";
import User from "./User";

class GuildMember {
	public client: Client;
	public guild: Guild;
	public user: User;

	public id: string;
	public displayName: string;
	public username: string;
	public nickname?: string;
	public roles: Array<Role>;
	public joined_at: Date;
	public boosting_since: Date;
	public deafened: boolean;
	public muted: boolean;
	public pendingJoin: boolean;
	public permissions?: string;
	public timeout_until?: Date;
	public color: number;
	public hoistRole: Role;
	public presence: GuildMemberPresence;

	constructor(client: Client, guild: Guild, data: any) {
		this.client = client;
		this.guild = guild;
		this.setup(data);
	}

	private setup(data: any) {
		if (data.avatar) data.user.avatar = data.avatar;
		const aliases = {
			nickname: "nick",
			boosting_since: "premium_since",
			deafened: "deaf",
			muted: "mute",
			timeout_until: "communication_disabled_until",
			pendingJoin: "pending"
		};
		const parsers = {
			user: i => new User(this.client, i),
			id: () => data.user.id,
			username: _ => data.user.username,
			roles: i => i.map(r => this.guild.roles.cache.find(r2 => r2.id == r)),
			pendingJoin: i => !!i,
			timeout_until: i => (i ? new Date(i) : null),
			color: () => this.roles.find(i => i.color)?.color || 0,
			hoistRole: () => this.roles.find(i => i.hoist),
			presence: d => (d ? new GuildMemberPresence(this.client, this.guild, this, d) : d),
			joined_at: d => new Date(d),
			boosting_since: d => (d ? new Date(d) : null),
			displayName: () => data.nick || data.user.username
		};
		fillClassValues(this, data, aliases, parsers);
	}

	public async fetch(): Promise<{ [key: string]: any }> {
		const data = await this.client.apiFetch(`/guilds/${this.guild.id}/members/${this.id}`);

		this.setup(data);

		return data;
	}
}

export default GuildMember;
