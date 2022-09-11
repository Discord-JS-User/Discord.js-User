import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";
import Message from "../../Message";

class GuildAnnouncementChannel extends GuildChannel {
	public type: number = 5;
	public topic?: string;
	public last_message?: Message;
	public rate_limit: number;

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.topic = data.topic;
		if (data.last_message_id) this.last_message = new Message(this.client, this, data.last_message_id);
		this.rate_limit = data.rate_limit_per_user;
	}
}

export default GuildAnnouncementChannel;
