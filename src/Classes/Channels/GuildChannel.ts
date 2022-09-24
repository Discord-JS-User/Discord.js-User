import BaseChannel from "../../BaseClasses/BaseChannel";
import Client from "../../Client";
import Guild from "../Guild";
import GuildCategory from "./GuildCategory";

class GuildChannel extends BaseChannel {
	public guild: Guild;
	public parent?: GuildCategory;
	public position: number;
	public topic?: string;
	public last_message_id?: string;

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
