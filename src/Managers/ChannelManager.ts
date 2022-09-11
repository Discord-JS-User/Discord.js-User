import { ChannelTypes, ChannelTypesEnum } from "../Types";
import Guild from "../Classes/Guild";
import Client from "../Client";
import AnyChannel from "../Classes/Channels/AnyChannel";

class ChannelManager {
	public client: Client;
	public guild: Guild;

	public cache: Array<ChannelTypesEnum[keyof ChannelTypesEnum]> = [];
	public rules_channel?: ChannelTypesEnum[keyof ChannelTypesEnum];
	public system_channel?: ChannelTypesEnum[keyof ChannelTypesEnum];
	public public_updates_channel?: ChannelTypesEnum[keyof ChannelTypesEnum];
	public afk_channel?: ChannelTypesEnum[keyof ChannelTypesEnum];

	constructor(client: Client, guild: Guild) {
		this.client = client;
		this.guild = guild;

		this.fetch();
	}

	public async fetch(id: string = null, force: boolean = false) {
		if (id && !force) {
			if (this.cache.find(i => i.id == id)) return this.cache.find(i => i.id == id);
		}
		let fetchedData = await this.client.apiFetch(id ? `/channels/${id}` : `/guilds/${this.guild.id}/channels`);
		if (!fetchedData) return null;
		if (!Array.isArray(fetchedData)) fetchedData = [fetchedData];
		let data: Array<ChannelTypesEnum[keyof ChannelTypesEnum]> = fetchedData.map((c: any) => {
			if (c.parent_id)
				c.parent = new ChannelTypes[4](
					this.client,
					(id ? this.cache : fetchedData).find((c2: any) => c2.id == c.parent_id),
					this.guild
				);
			return new (ChannelTypes[c.type] || AnyChannel)(this.client, c, this.guild);
		});
		data.forEach((channel: any) => {
			this.cache.find(c => c.id == channel.id) ? (this.cache[this.cache.indexOf(this.cache.find(c => c.id == channel.id))] = channel) : this.cache.push(channel);
			this.updateSpecialChannels(channel);
		});
		return id ? data[0] : data;
	}

	private updateSpecialChannels(data: any) {
		if (data.id == this.guild.raw.rules_channel_id) {
			this.rules_channel = data;
		}
		if (data.id == this.guild.raw.system_channel_id) {
			this.system_channel = data;
		}
		if (data.id == this.guild.raw.public_updates_channel_id) {
			this.public_updates_channel = data;
		}
		if (data.id == this.guild.raw.afk_channel_id) {
			this.afk_channel = data;
		}
	}
}

export default ChannelManager;
