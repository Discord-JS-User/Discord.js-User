import { Collection } from "@discord.js-user/utility";
import Client from "../../Client";
import { CustomStatus, PresenceData, PresenceStatus } from "../../Types";
import PresenceActivity from "../Presence/PresenceActivity";

export default class ClientUserPresence {
	public client: Client;

	/**
	 * The Activites
	 */
	public activities: Collection<PresenceActivity> = new Collection<PresenceActivity>();
	/**
	 * AFK Or Not
	 */
	public afk: boolean = false;
	/**
	 * State Since
	 */
	public since: number = 0;
	/**
	 * Status
	 */
	public status: PresenceStatus = "online";

	constructor(client: Client) {
		this.client = client;
	}

	public setActivity(data: PresenceData, clear: boolean = false) {
		this.activities = this.activities.filter(i => i.name != data.name);
		if (clear) return this.updatePresence();
		this.activities.push(new PresenceActivity(this.client, data));
		this.updatePresence();
	}

	public setAKF(afk: boolean) {
		this.afk = afk;
	}

	public setStatus(status: PresenceStatus) {
		this.status = status;
		this.since = Date.now();
	}

	public setCustomStatus(status: CustomStatus, clear: boolean = false) {
		status.name = "Custom Status";
		status.type = 4;
		this.activities = this.activities.filter(i => i.name != status.name);
		if (clear) return this.updatePresence();
		this.activities.push(new PresenceActivity(this.client, status));
		this.updatePresence();
	}

	public updatePresence() {
		this.client.sendMessage({
			op: 3,
			d: {
				activities: this.activities.toJSON().map(i => i.toJSON()),
				afk: this.afk,
				since: this.since,
				status: this.status
			}
		});
	}
}
