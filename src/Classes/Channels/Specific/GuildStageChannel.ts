import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";

/** A Guild Stage Channel */
class GuildStageChannel extends GuildChannel {
	/** The channel type (13) */
	public type: number = 13;
	/** The Voice BitRate of the channel */
	public bitrate: number;
	/** The max number of users that can be in the channel at once */
	public user_limit?: number;
	/** The RTC Region set for that channel */
	public rtc_region?: string;

	/**
	 * A Guild Stage Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.bitrate = data.bitrate;
		this.user_limit = data.user_limit;
		this.rtc_region = data.rtc_region;
	}
}

export default GuildStageChannel;
