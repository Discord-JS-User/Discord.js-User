import Client from "../../Client";
import { PresenceStatus } from "../../Types";
import Guild from "../Guild";
import GuildMember from "../GuildMember";
import User from "../User";
import PresenceGame from "./PresenceGame";
import PresenceActivity from "./PresenceActivity";

class GuildMemberPresence {
	public client: Client;
	public guild: Guild;
	public member: GuildMember;
	public user: User;

	public status: PresenceStatus;
	public game: PresenceGame;
	public client_statuses: {
		[platform: string]: PresenceStatus;
	};
	public activities: Array<PresenceActivity>;

	constructor(client: Client, guild: Guild, member: GuildMember, data: any) {
		this.client = client;
		this.guild = guild;
		this.member = member;
		this.user = this.member.user;

		this.status = data.status;
		this.game = data.game ? new PresenceGame(this.client, data.game) : null;
		this.client_statuses = data.client_statuses;
		this.activities = data.activities?.map(i => new PresenceActivity(this.client, i)) || [];
	}
}

export default GuildMemberPresence;
