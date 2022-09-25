import Client from "../../Client";
import { ActivityButton, ActivityAssets, ActivityEmoji, ActivityParty, ActivitySecrets, ActivityTimestamps, ActivityType } from "../../Types";
import { fillClassValues } from "../../utils";

/** An activity for a presence */
class PresenceActivity {
	/** The Client */
	public client: Client;

	/** The Activity Name */
	public name: string;
	/** The Activity ID */
	public id: string | "custom";
	/** The Activity Type */
	public type: ActivityType;
	/** The Activity Stream URL, only with type 1 */
	public url?: string;
	/** The time that the activity was added to the user */
	public created_at: Date;
	/** The start and end for the activity (normally for games) */
	public timestamps?: ActivityTimestamps;
	/** The Application ID */
	public application_id?: string;
	/** What the player is currently doing */
	public details?: string;
	/** The User's current party status */
	public state?: string;
	/** The Emoji used in Custom Status (Only in type 4) */
	public emoji?: ActivityEmoji;
	/** Information about the current party for the player */
	public party?: ActivityParty;
	/** Images and hover texts for the presence */
	public assets?: ActivityAssets;
	/** Secrets for joining and spectating */
	public secrets?: ActivitySecrets;
	/** Whether or not the activity is an instanced game session */
	public instance?: boolean;
	/** Flags for the activity */
	public flags?: number;
	/** Custom buttons shown in the Rich Presence (max 2) */
	public buttons?: Array<ActivityButton>;
	public session_id?: string;

	/**
	 * An activity for a presence
	 * @param client The Client
	 * @param data Data to fill
	 */
	constructor(client: Client, data: any) {
		this.client = client;

		const aliases = {};
		const parsers = {
			timestamps: d => {
				{
					if (d) {
						d.start = d.start ? new Date(d.start) : undefined;
						d.end = d.end ? new Date(d.end) : undefined;
						return d;
					} else return undefined;
				}
			},
			emoji: d => {
				if (d && d.id) {
					d.url = `https://cdn.discordapp.com/emojis/${d.id}.${d.animated ? "gif" : "png"}`;
				}
				return d;
			},
			created_at: d => (d ? new Date(d) : d)
		};
		fillClassValues(this, data, aliases, parsers, ["member", "presence"]);
	}

	/**
	 * Convert the activity to JSON
	 * @returns The JSON data for the activity
	 */
	public toJSON() {
		const properties = Object.keys(this).filter(i => i != "client" && i != "constructor" && i != "toJSON");
		let data: any = {};
		for (const property of properties) {
			data[property] = this[property];
		}
		for (const property of Object.keys(data).filter(i => data[i] === undefined)) {
			delete data[property];
		}
		if (data.timestamps) {
			if (data.timestamps.start && typeof data.timestamps.start.getTime == "function") data.timestamps.start = data.timestamps.start.getTime();
			if (data.timestamps.end && typeof data.timestamps.end.getTime == "function") data.timestamps.end = data.timestamps.end.getTime();
		}
		return data;
	}
}

export default PresenceActivity;
