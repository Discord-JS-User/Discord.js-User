import Client from "../../../../Client";
import { ClientThreadMember, ThreadMember, ThreadMetaData } from "../../../../Types";
import Guild from "../../../Guild";
import GuildChannel from "../../GuildChannel";

/** A Public Thread Channel */
export class PublicThreadChannel extends GuildChannel {
	/** The channel type (11) */
	public type: number = 11;

	/** The channel message ratelimit */
	public rate_limit: number;
	/** The total number of messages in the channel */
	public message_count: number;
	/** Metadata for the thread */
	public thread_meta: ThreadMetaData;

	/** The thread member for the client */
	public member: ClientThreadMember;
	/** Members who are in the thread */
	public members: ThreadMember[];

	/**
	 * A Public Thread Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
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
