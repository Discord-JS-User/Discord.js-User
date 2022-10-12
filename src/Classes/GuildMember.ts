import { Collection } from "@djs-user/collection";
import Client from "../Client";
import { fillClassValues } from "../utils";
import Guild from "./Guild";
import GuildMemberPresence from "./Presence/GuildMemberPresence";
import Role from "./Role";
import User from "./User";

/** A Guild Member */
class GuildMember {
	/** The raw data for the Guild Member */
	public raw: any;

	/** The Client */
	public client: Client;
	/** The Guild for the Guild Member */
	public guild: Guild;
	/** The Guild Member User */
	public user: User;

	/** The Member ID */
	public id: string;
	/** The Member Username */
	public username: string;
	/** The Member Nickname (If Set) */
	public nickname?: string;
	/** The Member Display Name (The nickname if there is one, otherwise the username) */
	public displayName: string;
	/** Roles for the Member */
	public roles: Collection<Role>;
	/** When the Member join the Guild */
	public joined_at: Date;
	/** When the Member started boosting the server (If they are boosting) */
	public boosting_since?: Date;
	/** Whether the Member is Voice Deafened */
	public deafened?: boolean;
	/** Whether the Member is Voice Muted */
	public muted?: boolean;
	/** Whether the Member is still on the screen where they have to agree to the rules */
	public pendingJoin: boolean;
	/** A Permissions Bit Set for the Member */
	public permissions?: string;
	/** When the Member will get off of being Timed Out (If they are timed out) */
	public timeout_until?: Date;
	/** The Member Role Color */
	public color: number;
	/** The Role that should hoist the member */
	public hoistRole: Role;
	/** The presence for the Member */
	public presence: GuildMemberPresence;

	/**
	 * A Guild Member
	 * @param client The Client
	 * @param guild The Guild for the Guild Member
	 * @param data Data to fill
	 */
	constructor(client: Client, guild: Guild, data: any) {
		this.client = client;
		this.guild = guild;
		this.setup(data);
	}

	/** @private */
	public _updatePresence(presence: any) {
		this.presence = new GuildMemberPresence(this.client, this.guild, this, presence);
	}

	private setup(data: any) {
		this.raw = data;
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
			user: i => this.client.createUser(i),
			id: () => data.user.id,
			username: _ => data.user.username,
			roles: i => new Collection<Role>(i.map(r => this.guild.roles.cache.find(r2 => r2.id == r))),
			pendingJoin: i => !!i,
			timeout_until: i => (i ? new Date(i) : null),
			color: () => this.roles.find(i => !!i?.color)?.color || 0,
			hoistRole: () => this.roles.find(i => i?.hoist),
			presence: d => (d ? new GuildMemberPresence(this.client, this.guild, this, d) : d),
			joined_at: d => new Date(d),
			boosting_since: d => (d ? new Date(d) : null),
			displayName: () => data.nick || data.user.username
		};
		fillClassValues(this, data, aliases, parsers, ["raw"]);
	}

	/**
	 * Fetch and Update the GuildMember
	 * @returns The Raw Response Data (Not parsed to a GuildMember Object)
	 */
	public async fetch(): Promise<{ [key: string]: any }> {
		const data = await this.client.apiFetch(`/guilds/${this.guild.id}/members/${this.id}`);

		this.setup(data);

		return data;
	}
}

export default GuildMember;
