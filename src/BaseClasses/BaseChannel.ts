import { Collection } from "@discord.js-user/utility";
import Client from "../Client";
import { ChannelPermissionOverwrite } from "../Types";
import { fillClassValues } from "../utils";

class BaseChannel {
	public client: Client;

	public id: string;
	public name?: string;
	public permission_overwrites?: Collection<ChannelPermissionOverwrite>;
	public nsfw?: boolean;
	public flags?: number;

	constructor(client: Client, data: any) {
		this.client = client;
		this.id = data.id;
		this.name = data.name;
		this.permission_overwrites = new Collection<ChannelPermissionOverwrite>(data.permission_overwrites);
		this.nsfw = !!data.nsfw;
		this.flags = data.flags;
	}

	public async fetch() {
		fillClassValues(this, await this.client.apiFetch(`/channels/${this.id}`));
		return this;
	}
}

export default BaseChannel;
