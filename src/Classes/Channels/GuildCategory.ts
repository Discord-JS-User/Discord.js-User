import BaseChannel from "../../BaseClasses/BaseChannel";
import Client from "../../Client";
import Guild from "../Guild";

class GuildCategory extends BaseChannel {
	public type: number = 4;
	public guild: Guild;
	public position: number;

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data);
		this.guild = guild;
		this.position = data.position;
	}
}

export default GuildCategory;
