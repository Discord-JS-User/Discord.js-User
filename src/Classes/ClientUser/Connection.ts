import { Collection } from "@djs-user/utility";
import Client from "../../Client";
import { Integration } from "../../Types";
import { fillClassValues } from "../../utils";

/** A Connection for the Client User */
export default class Connection {
	/** The client */
	public client: Client;

	/** The Connection ID */
	public id: string;
	/** The Connection Name */
	public name: string;
	/** The Connection Type */
	public type: string;
	/** Whether the connection was revoked */
	public revoked: boolean;
	/** Integrations for the connection */
	public integrations?: Collection<Integration>;
	/** Whether the connection is verified */
	public verified: boolean;
	public friend_sync: boolean;
	/** Whether to show the connection activity on the User's Profile */
	public show: boolean;
	/** The visibility of the connection */
	public visibility: 0 | 1;

	/**
	 * A Connection for the Client User
	 * @param client The client
	 * @param data Data to fill
	 */
	constructor(client: Client, data: any) {
		this.client = client;

		fillClassValues(
			this,
			data,
			{
				show: "show_activity"
			},
			{
				revoked: i => !!i,
				integrations: ds =>
					ds
						? new Collection<Integration>(
								ds.map(d => {
									if (!d || typeof d != "object") return d;
									if (d.user) d.user = this.client.createUser(d.user);
									if (d.synced_at) d.synced_at = new Date(d.synced_at);
									if (d.application && d.application.bot) d.application.bot = this.client.createUser(d.application.bot);
									return d;
								})
						  )
						: undefined
			}
		);

		for (const item of Object.keys(data)) {
			if (this[item] === undefined) this[item] = data[item];
		}
	}
}
