import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";

class GuildAnnouncementChannel extends GuildChannel {
	public type: number = 5;
	public rate_limit: number;

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.rate_limit = data.rate_limit_per_user;
	}
}

export default GuildAnnouncementChannel;
