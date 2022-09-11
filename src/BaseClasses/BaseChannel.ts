import Client from "../Client";
import { ChannelPermissionOverwrite } from "../Types";

class BaseChannel {
	public client: Client;

	public id: string;
	public name?: string;
	public permission_overwrites?: Array<ChannelPermissionOverwrite>;
	public nsfw?: boolean;

	constructor(client: Client, data: any) {
		this.client = client;
		this.id = data.id;
		this.name = data.name;
		this.permission_overwrites = data.permission_overwrites;
		this.nsfw = !!data.nsfw;
	}
}

export default BaseChannel;
