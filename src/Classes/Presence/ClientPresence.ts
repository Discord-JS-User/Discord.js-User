import Client from "../../Client";
import { CustomStatus, PresenceData, PresenceStatus } from "../../Types";
import PresenceActivity from "./PresenceActivity";

export default class ClientUserPresence {
	public client: Client;
	public lastUpdate: number = 0;

	/**
	 * The Activites
	 */
	public activities: PresenceActivity[] = [];
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

	public setCustomStatus(clear: boolean = false, status: CustomStatus) {
		status.name = "Custom Status";
		status.type = 4;
		this.activities = this.activities.filter(i => i.name != status.name);
		if (clear) return this.updatePresence();
		this.activities.push(new PresenceActivity(this.client, status));
		this.updatePresence();
	}

	public updatePresence() {
		this.client.Logger.log("Presence Update Requested");
		setTimeout(
			() => {
				this.client.Logger.log("Presence Updating");
				this.client.sendMessage({
					op: 3,
					d: {
						activities: this.activities.map(i => i.toJSON()),
						afk: this.afk,
						since: this.since,
						status: this.status
					}
				});
				this.lastUpdate = Date.now();
			},
			Date.now() - this.lastUpdate < 5000 ? Date.now() - this.lastUpdate : 0
		);
	}
}
