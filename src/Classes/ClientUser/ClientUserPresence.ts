import { Collection } from "@djs-user/utility";
import Client from "../../Client";
import { CustomStatus, PresenceData, PresenceStatus } from "../../Types";
import PresenceActivity from "../Presence/PresenceActivity";

/** Presence for the Client User */
export default class ClientUserPresence {
	/** The client */
	public client: Client;

	/** The Activites */
	public activities: Collection<PresenceActivity> = new Collection<PresenceActivity>();
	/** AFK Or Not */
	public afk: boolean = false;
	/** State Since */
	public since: number | null = null;
	/** Status */
	public status: PresenceStatus = "online";

	/**
	 * Presence for the Client User
	 * @param client The client
	 */
	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Add (or Edit) an activity for the user
	 * @param data The Data for the activity
	 * @param clear Whether it should just clear the activity and ignore the data
	 * @returns The New Presence
	 */
	public setActivity(data: PresenceData, clear: boolean = false): this {
		this.activities = this.activities.filter(i => i.name != data.name);
		if (clear) return this.updatePresence();
		this.activities.push(new PresenceActivity(this.client, data));
		return this.updatePresence();
	}

	/**
	 * Set whether the client is AFK
	 * @param afk Whether the client is AFK
	 * @returns The New Presence
	 */
	public setAKF(afk: boolean): this {
		this.afk = afk;
		if (this.afk) this.since = Date.now();
		else this.since = null;
		return this.updatePresence();
	}

	/**
	 * Set the client status
	 * @param status The status ("online" or "offline" or "idle" or "dnd" or "invisible")
	 * @returns The New Presence
	 */
	public setStatus(status: PresenceStatus): this {
		this.status = status;
		return this.updatePresence();
	}

	/**
	 * Set the Custom Status for the Client
	 * @param status The Custom Status
	 * @param clear Whether it should just clear the activity and ignore the data
	 * @returns The New Presence
	 */
	public setCustomStatus(status: CustomStatus, clear: boolean = false): this {
		status.name = "Custom Status";
		status.type = 4;
		this.activities = this.activities.filter(i => i.name != status.name);
		if (clear) return this.updatePresence();
		this.activities.push(new PresenceActivity(this.client, status));
		return this.updatePresence();
	}

	/**
	 * Send an update in the presence
	 * @returns The Presence
	 */
	public updatePresence(): this {
		this.client.sendMessage({
			op: 3,
			d: {
				activities: this.activities.toJSON().map(i => i.toJSON()),
				afk: this.afk,
				since: this.since,
				status: this.status
			}
		});
		return this;
	}
}
