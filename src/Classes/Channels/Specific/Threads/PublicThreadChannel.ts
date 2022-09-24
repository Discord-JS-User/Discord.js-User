import Client from "../../../../Client";
import { ClientThreadMember, ThreadMember, ThreadMetaData } from "../../../../Types";
import Guild from "../../../Guild";
import GuildChannel from "../../GuildChannel";

export class PublicThreadChannel extends GuildChannel {
	public type: number = 11;

	public rate_limit: number;
	public message_count: number;
	public thread_meta: ThreadMetaData;
	public member: ClientThreadMember;

	public members: ThreadMember[];

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.rate_limit = data.rate_limit;
		this.message_count = data.message_count;
		this.thread_meta = data.thread_meta;
		this.member = data.member;
	}

	public pushMember(data: ThreadMember) {
		if (this.members.find(i => i.user_id && i.user_id === data.user_id)) {
			this.members[this.members.indexOf(this.members.find(i => i.user_id && i.user_id === data.user_id))] = data;
		} else {
			this.members.push(data);
		}
	}
}
