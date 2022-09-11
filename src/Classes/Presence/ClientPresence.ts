import Client from "../../Client";
import { PresenceData, PresenceStatus } from "../../Types";
import PresenceGame from "./PresenceGame";

export default class ClientUserPresence {
	public client: Client;

	/**
	 * The Activites
	 */
	public activities: PresenceGame[] = [];
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
	public status: PresenceStatus;

	constructor(client: Client) {
		this.client = client;
	}

	public setActivity(data: PresenceData) {
		if (this.activities.find(i => i.name == data.name)) {
			this.activities[this.activities.indexOf(this.activities.find(i => i.name == data.name))] = new PresenceGame(this.client, data);
		} else {
			this.activities.push(new PresenceGame(this.client, data));
		}
		this.updatePresence();
	}

	public setAKF(afk: boolean) {
		this.afk = afk;
	}

	public setStatus(status: PresenceStatus) {
		this.status = status;
		this.since = Date.now();
	}

	public updatePresence() {
		this.client.sendMessage({
			op: 3,
			d: {
				activties: this.activities,
				afk: this.afk,
				since: this.since,
				status: this.status
			}
		});
	}
}
