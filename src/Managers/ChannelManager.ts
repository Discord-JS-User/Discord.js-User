import { ChannelType, ChannelTypes } from "../Types";
import Guild from "../Classes/Guild";
import Client from "../Client";
import AnyChannel from "../Classes/Channels/AnyChannel";
import { Collection } from "@discord.js-user/utility";

class ChannelManager {
	public client: Client;
	public guild: Guild;

	public readonly cache: Collection<ChannelType> = new Collection<ChannelType>();
	public rules_channel?: ChannelType;
	public system_channel?: ChannelType;
	public public_updates_channel?: ChannelType;
	public afk_channel?: ChannelType;

	constructor(client: Client, guild: Guild, data?: any) {
		this.client = client;
		this.guild = guild;
		if (data) this.pushToCache(data);
	}

	public pushToCache(channels: any | any[]) {
		if (!Array.isArray(channels)) channels = [channels];
		const ThreadTypes = [10, 11, 12];
		for (let channel of channels) {
			if (channel.parent_id) {
				let parentChannel = this.cache.find((c2: any) => c2.id == channel.parent_id);
				if (parentChannel) channel.parent = parentChannel;
				else {
					parentChannel = channels.find((c2: any) => c2.id == channel.parent_id);
					if (parentChannel && !ThreadTypes.includes(parseInt(channel.type))) channel.parent = new ChannelTypes[4](this.client, parentChannel, this.guild);
					else if (parentChannel) channel.parent = new AnyChannel(this.client, parentChannel, this.guild);
				}
			}
			channel = new (ChannelTypes[channel.type] || AnyChannel)(this.client, channel, this.guild);
			this.cache.push(channel);
			this.updateSpecialChannels(channel);
		}
		return this.cache;
	}

	public async fetch(id: string = null, force: boolean = false) {
		if (id && !force) {
			if (this.cache.find(i => i.id == id)) return this.cache.find(i => i.id == id);
		}
		let fetchedData = await this.client.apiFetch(id ? `/channels/${id}` : `/guilds/${this.guild.id}/channels`);
		if (!fetchedData) return null;
		if (!Array.isArray(fetchedData)) fetchedData = [fetchedData];
		const data = this.pushToCache(fetchedData);
		return id ? data.find(i => i.id == id) || data : data;
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

	public remove(channel: ChannelType) {
		const item = this.cache.find(i => i.id == channel.id);
		if (!item) return channel;
		this.cache.remove(item);
		return item;
	}
}

export default ChannelManager;
