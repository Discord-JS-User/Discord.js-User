import { Collection } from "@djs-user/utility";
import Client from "../../Client";
import { PresenceStatus, SessionClientInfo } from "../../Types";
import { fillClassValues } from "../../utils";
import PresenceActivity from "../Presence/PresenceActivity";

/** A Client Session */
export default class Session {
	/** The Client */
	public client: Client;
	/** Whether the session is the current clienr session */
	public isClientSession: boolean;

	/** The status of the session */
	public status: PresenceStatus;
	/** The Session ID */
	public session_id: "all" | string;
	/** Client info for the session */
	public client_info: SessionClientInfo;
	/** Activities for the session */
	public activities: Collection<PresenceActivity>;
	public active: boolean;

	/**
	 * A Client Session
	 * @param client The Client
	 * @param data Data to fill
	 */
	constructor(client: Client, data: any) {
		this.client = client;

		fillClassValues(
			this,
			data,
			{},
			{
				active: d => !!d,
				activities: d => new Collection<PresenceActivity>(d.map(i => new PresenceActivity(this.client, i)))
			}
		);

		this.isClientSession = this.session_id == this.client.session_id;
	}
}
