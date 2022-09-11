import Client from "../../Client";
import { ActivityEmoji, ActivityType } from "../../Types";
import { fillClassValues } from "../../utils";
import Guild from "../Guild";
import GuildMember from "../GuildMember";
import GuildMemberPresence from "./GuildMemberPresence";

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

	constructor(client: Client, data: any) {
		this.client = client;

		const aliases = {};
		const parsers = {
			timestamps: d => {
				{
					if (d) {
						d.start = d.start ? new Date(d.start) : null;
						d.end = d.end ? new Date(d.end) : null;
						return d;
					} else return null;
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
}

export default PresenceActivity;
