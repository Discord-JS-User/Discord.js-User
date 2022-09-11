import Client from "../Client";
import { ChannelTypesEnum } from "../Types";

class Message {
	constructor(client: Client, channel: ChannelTypesEnum[keyof ChannelTypesEnum], data: any) {}
}

export default Message;
