import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";

/** A Guild Text Channel */
class GuildTextChannel extends GuildChannel {
	/** The channel type (0) */
	public type: number = 0;
	/** The channel message ratelimit */
	public rate_limit: number;
	/** The timestamp of the last pinned message in this channel */
	public last_pin_timestamp?: string;

	/**
	 * A Guild Text Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.rate_limit = data.rate_limit_per_user;
		this.last_pin_timestamp = data.last_pin_timestamp;
	}
}

export default GuildTextChannel;
