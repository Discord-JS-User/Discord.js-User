import BaseChannel from "../../BaseClasses/BaseChannel";
import Client from "../../Client";
import Guild from "../Guild";

/** A Guild Category */
class GuildCategory extends BaseChannel {
	/** The channel type (4) */
	public type: number = 4;
	/** The Guild that the Category is in */
	public guild: Guild;
	/** The position for the category */
	public position: number;

	/**
	 * A Guild Category
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
	constructor(client: Client, data: any, guild: Guild) {
		super(client, data);
		this.guild = guild;
		this.position = data.position;
	}
}

export default GuildCategory;
