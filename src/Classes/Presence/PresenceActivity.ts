import Client from "../../Client";
import { ActivityEmoji, ActivityType } from "../../Types";
import { fillClassValues } from "../../utils";

class PresenceActivity {
	public client: Client;

	public name: string;
	public id: string | "custom";
	public type: ActivityType;
	public url?: string;
	public created_at: Date;
	public timestamps?: {
		start?: Date;
		end?: Date;
	};
	public application_id?: string;
	public details?: string;
	public state?: string;
	public emoji?: ActivityEmoji;
	public party?: {
		id?: string;
		size?: [number, number];
	};
	public assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	public secrets?: {
		join?: string;
		spectate?: string;
		match?: string;
	};
	public instance?: boolean;
	public flags?: number;
	public buttons?: Array<{
		label?: string;
		url?: string;
	}>;
	public session_id?: string;

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

	public toJSON() {
		const properties = Object.keys(this).filter(i => i != "client" && i != "constructor" && i != "toJSON");
		let data = {};
		for (const property of properties) {
			data[property] = this[property];
		}
		for (const property of Object.keys(data).filter(i => data[i] === undefined)) {
			delete data[property];
		}
		// @ts-ignore
		if (data.timestamps) {
			// @ts-ignore
			if (data.timestamps.start && typeof data.timestamps.start.getTime == "function") data.timestamps.start = data.timestamps.start.getTime();
			// @ts-ignore
			if (data.timestamps.end && typeof data.timestamps.end.getTime == "function") data.timestamps.end = data.timestamps.end.getTime();
		}
		return data;
	}
}

export default PresenceActivity;
