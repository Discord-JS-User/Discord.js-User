import { ChannelType, ChannelTypes } from "../Types";
import Guild from "../Classes/Guild";
import Client from "../Client";
import AnyChannel from "../Classes/Channels/AnyChannel";
import BaseManager from "../BaseClasses/BaseManager";

/** A Manager for Guild Channels */
class ChannelManager extends BaseManager<ChannelType> {
	/** The Guild */
	public guild: Guild;

	/** The Guild Rules Channel */
	public rules_channel?: ChannelType;
	/** The Guild System Updates Channel */
	public system_channel?: ChannelType;
	/** The Guild Public Updates Channel */
	public public_updates_channel?: ChannelType;
	/** The Guild AFK Channel */
	public afk_channel?: ChannelType;

	/**
	 * A Manager for Guild Channels
	 * @param client The Client
	 * @param guild The Guild
	 * @param data Data to fill (only if you have it)
	 */
	constructor(client: Client, guild: Guild, data?: any) {
		super(client);
		this.guild = guild;
		if (data) this.pushToCache(data);
	}

	/**
	 * Push one or more channels to the cache
	 * @param channels The channels
	 * @returns The updated cache
	 */
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

	/**
	 * Fetch one or all of the channels
	 * @param id The Channel ID (If none is specified, returns all of them)
	 * @param force Whether to force the fetch (only if an ID is specified)
	 * @returns The updated cache OR the channel that has the specified ID
	 */
	public async fetch(id: string = null, force: boolean = false) {
		if (id && typeof id != "string") throw new TypeError(`ID Value (\`${id}\`) Is Not A String`);
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

	/**
	 * Remove a channel from the cache
	 * @param channel The channel to remove
	 * @returns The removed channel
	 */
	public remove(channel: ChannelType) {
		const item = this.cache.find(i => i.id == channel.id);
		if (!item) return channel;
		this.cache.remove(item);
		return item;
	}
}

export default ChannelManager;
