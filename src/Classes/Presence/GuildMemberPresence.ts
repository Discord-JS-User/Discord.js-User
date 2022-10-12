import Client from "../../Client";
import Guild from "../Guild";
import GuildMember from "../GuildMember";
import UserPresence from "./UserPresence";

/** The Presence for a Guild Member */
class GuildMemberPresence extends UserPresence {
	/** The Guild */
	public guild: Guild;
	/** The Guild Member */
	public member: GuildMember;

	/**
	 * The Presence for a Guild Member
	 * @param client The Client
	 * @param guild The Guild
	 * @param member The Guild Member
	 * @param data Data to set
	 */
	constructor(client: Client, guild: Guild, member: GuildMember, data: any = {}) {
		super(client, member.user, data);
		this.guild = guild;
		this.member = member;
	}
}

export default GuildMemberPresence;
