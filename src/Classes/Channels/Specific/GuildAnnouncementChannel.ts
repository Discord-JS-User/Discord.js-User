import Guild from "../../Guild";
import GuildChannel from "../GuildChannel";
import Client from "../../../Client";

/** A Guild Announcemnet Channel */
class GuildAnnouncementChannel extends GuildChannel {
	/** The channel type (5) */
	public type: number = 5;
	/** The channel message ratelimit */
	public rate_limit: number;

	/**
	 * A Guild Announcement Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
	constructor(client: Client, data: any, guild: Guild) {
		super(client, data, guild);
		this.rate_limit = data.rate_limit_per_user;
	}
}

export default GuildAnnouncementChannel;
