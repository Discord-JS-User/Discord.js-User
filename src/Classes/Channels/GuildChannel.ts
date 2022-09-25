import BaseChannel from "../../BaseClasses/BaseChannel";
import Client from "../../Client";
import Guild from "../Guild";
import GuildCategory from "./GuildCategory";

/** A Guild Channel */
class GuildChannel extends BaseChannel {
	/** The Guild that the Channel is in */
	public guild: Guild;
	/** The parent for the channel */
	public parent?: GuildCategory;
	/** The position for the channel */
	public position: number;
	/** The channel topic */
	public topic?: string;
	/** The ID of the last message in the channel */
	public last_message_id?: string;

	/**
	 * A Guild Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 * @param guild The guild the channel was made in
	 */
	constructor(client: Client, data: any, guild: Guild) {
		super(client, data);
		this.guild = guild;
		if (data.parent) this.parent = data.parent.guild ? data.parent : new GuildCategory(this.client, data.parent, this.guild);
		this.position = data.position;
		this.topic = data.topic;
		this.last_message_id = data.last_message_id;
	}
}

export default GuildChannel;
