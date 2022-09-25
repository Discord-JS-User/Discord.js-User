import Client from "../Client";
import { ChannelType } from "../Types";

export default class Message {
	public client: Client;
	public channel: ChannelType;

	constructor(client: Client, channel: ChannelType, data: any) {
		this.client = client;
		this.channel = channel;
	}
}
