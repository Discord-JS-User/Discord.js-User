import { Collection } from "@djs-user/collection";
import Client from "../Client";
import { ChannelPermissionOverwrite } from "../Types";
import { fillClassValues } from "../utils";

/** A Basic Channel */
class BaseChannel {
	/** The Client that the Channel was made from */
	public client: Client;

	/** The ID of the channel */
	public id: string;
	/** The name of the channel */
	public name?: string;
	/** Permission Overwrites for the channel */
	public permission_overwrites?: Collection<ChannelPermissionOverwrite>;
	/** Whether the channel is an NSFW channe; */
	public nsfw?: boolean;
	/** Flags for the channel */
	public flags?: number;

	/**
	 * A Basic Channel
	 * @param client The Client that the Channel was made from
	 * @param data Data to fill for the Channel
	 */
	constructor(client: Client, data: any) {
		this.client = client;
		this.id = data.id;
		this.name = data.name;
		this.permission_overwrites = new Collection<ChannelPermissionOverwrite>(data.permission_overwrites);
		this.nsfw = !!data.nsfw;
		this.flags = data.flags;
	}

	/**
	 * Fetch and update the channel from the API
	 * @returns The updated channel
	 */
	public async fetch(): Promise<this> {
		fillClassValues(this, await this.client.apiFetch(`/channels/${this.id}`));
		return this;
	}
}

export default BaseChannel;
