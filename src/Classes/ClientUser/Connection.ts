import Client from "../../Client";
import { Integration } from "../../Types";
import { fillClassValues } from "../../utils";
import User from "../User";

export default class Connection {
	public client: Client;

	public id: string;
	public name: string;
	public type: string | number;
	public revoked: boolean;
	public integrations?: Array<Integration>;
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
				revoked: i => !!i,
				integrations: d => {
					if (!d || typeof d != "object") return d;
					if (d.user) d.user = this.client.createUser(d.user);
					if (d.synced_at) d.synced_at = new Date(d.synced_at);
					if (d.application && d.application.bot) d.application.bot = this.client.createUser(d.application.bot);
					return d;
				}
			}
		);

		for (const item of Object.keys(data)) {
			if (this[item] === undefined) this[item] = data[item];
		}
	}
}
