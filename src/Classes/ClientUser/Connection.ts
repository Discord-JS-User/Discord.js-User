import Client from "../../Client";
import { fillClassValues } from "../../utils";
import GuildIntegration from "../GuildIntegration";

export default class Connection {
	public client: Client;

	public id: string;
	public name: string;
	public type: string | number;
	public revoked: boolean;
	public integrations?: Array<GuildIntegration>;
	public verified: boolean;
	public friend_sync: boolean;
	public show: boolean;
	public visibility: 0 | 1;

	constructor(client: Client, data: any) {
		this.client = client;

		fillClassValues(
			this,
			data,
			{
				show: "show_activitiy"
			},
			{
				revoked: i => !!i
			}
		);

		for (const item of Object.keys(data)) {
			if (this[item] === undefined) this[item] = data[item];
		}
	}
}
