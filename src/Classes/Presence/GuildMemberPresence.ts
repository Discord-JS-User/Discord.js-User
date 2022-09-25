import { Collection } from "@djs-user/utility";
import Client from "../../Client";
import { PresenceStatus } from "../../Types";
import Guild from "../Guild";
import GuildMember from "../GuildMember";
import User from "../User";
import PresenceActivity from "./PresenceActivity";

/** The Presence for a Guild Member */
class GuildMemberPresence {
	/** The Client */
	public client: Client;
	/** The Guild */
	public guild: Guild;
	/** The Guild Member */
	public member: GuildMember;
	/** The User for the Guild Member */
	public user: User;

	/** The User Status */
	public status: PresenceStatus;
	/**
	 * The User Game
	 *
	 * (The activity that should be shown in the Member Status)
	 */
	public game?: PresenceActivity;
	/** Statuses for all the User's platforms */
	public client_statuses: {
		[platform: string]: PresenceStatus;
	};
	/** All activities for the user */
	public activities: Collection<PresenceActivity>;

	/**
	 * The Presence for a Guild Member
	 * @param client The Client
	 * @param guild The Guild
	 * @param member The Guild Member
	 * @param data Data to set
	 */
	constructor(client: Client, guild: Guild, member: GuildMember, data: any) {
		this.client = client;
		this.guild = guild;
		this.member = member;
		this.user = this.member.user;

		this.status = data.status || "offline";
		this.game = data.game ? new PresenceActivity(this.client, data.game) : null;
		this.client_statuses = data.client_statuses || {};
		this.activities = new Collection<PresenceActivity>(data.activities?.map(i => new PresenceActivity(this.client, i)) || []);
	}

	/**
	 * Update the presence
	 * @param data Data to set
	 * @returns The Updated Presence
	 */
	public update(data: any): this {
		this.status = data.status || "offline";
		this.game = data.game ? new PresenceActivity(this.client, data.game) : null;
		this.client_statuses = data.client_statuses || {};
		this.activities = new Collection<PresenceActivity>(data.activities?.map(i => new PresenceActivity(this.client, i)) || []);
		return this;
	}
}

export default GuildMemberPresence;
