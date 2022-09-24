import Client from "../../Client";
import { PresenceStatus, SessionClientInfo } from "../../Types";
import { fillClassValues } from "../../utils";
import PresenceActivity from "../Presence/PresenceActivity";

export default class Session {
	public client: Client;
	public isClientSession: boolean;

	public status: PresenceStatus;
	public session_id: "all" | string;
	public client_info: SessionClientInfo;
	public activities: PresenceActivity[];
	public active: boolean;

	constructor(client: Client, data: any) {
		this.client = client;

		fillClassValues(
			this,
			data,
			{},
			{
				active: d => !!d,
				activities: d => d.map(i => new PresenceActivity(this.client, i))
			}
		);

		this.isClientSession = this.session_id == this.client.session_id;
	}
}
