import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";
import Message from "../../Message";

class GuildVoiceChannel extends GuildChannel {
	public type: number = 2;
	public bitrate: number;
	public user_limit?: number;
	public rate_limit: number;
	public rtc_region?: string;

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.bitrate = data.bitrate;
		this.user_limit = data.user_limit;
		this.rate_limit = data.rate_limit_per_user;
		this.rtc_region = data.rtc_region;
	}
}

export default GuildVoiceChannel;
