import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";

/** A Guild Voice Channel */
class GuildVoiceChannel extends GuildChannel {
	/** The channel type (2) */
	public type: number = 2;
	/** The Voice BitRate of the channel */
	public bitrate: number;
	/** The max number of users that can be in the channel at once */
	public user_limit?: number;
	/** The channel message ratelimit */
	public rate_limit: number;
	/** The RTC Region set for that channel */
	public rtc_region?: string;

	/**
	 * A Guild Voice Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.bitrate = data.bitrate;
		this.user_limit = data.user_limit;
		this.rate_limit = data.rate_limit_per_user;
		this.rtc_region = data.rtc_region;
	}
}

export default GuildVoiceChannel;
