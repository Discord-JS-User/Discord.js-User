import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";

/** A Guild Forum Channel */
class GuildForumChannel extends GuildChannel {
	/** The channel type (15) */
	public type: number = 15;
	/** The channel message ratelimit */
	public rate_limit: number;
	/** The default amount of time before a thread gets archived */
	public default_auto_archive?: number;

	/**
	 * A Guild Forum Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.rate_limit = data.rate_limit_per_user;
		this.default_auto_archive = data.default_auto_archive_duration;
	}
}

export default GuildForumChannel;
