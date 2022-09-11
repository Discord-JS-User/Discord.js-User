import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";
import Message from "../../Message";

class GuildForumChannel extends GuildChannel {
	public type: number = 15;
	public topic?: string;
	public last_message: Message;
	public rate_limit: number;
	public default_auto_archive?: number;

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.topic = data.topic;
		if (data.last_message_id) this.last_message = new Message(this.client, this, data.last_message_id);
		this.rate_limit = data.rate_limit_per_user;
		this.default_auto_archive = data.default_auto_archive_duration;
	}
}

export default GuildForumChannel;
