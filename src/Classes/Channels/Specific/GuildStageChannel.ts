import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";

class GuildStageChannel extends GuildChannel {
	public type: number = 13;
	public bitrate: number;
	public user_limit?: number;
	public rtc_region?: string;

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.bitrate = data.bitrate;
		this.user_limit = data.user_limit;
		this.rtc_region = data.rtc_region;
	}
}

export default GuildStageChannel;
