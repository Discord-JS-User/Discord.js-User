import Client from "../Client";
import { fillClassValues } from "../utils";
import Guild from "./Guild";

class Role {
	public client: Client;
	public guild: Guild;

	public id: string;
	public name: string;
	public color: number;
	public hoist: boolean;
	public icon?: string;
	public emoji?: string;
	public position: number;
	public permissions: string;
	public managed: boolean;
	public mentionable: boolean;
	public tags?: {
		bot_id?: string;
		integration_id?: string;
		premium_subscriber?: boolean;
	};

	constructor(client: Client, guild: Guild, data: any) {
		this.client = client;
		this.guild = guild;

		const aliases = {
			emoji: "unicode_emoji"
		};
		const parsers = {};
		fillClassValues(this, data, aliases, parsers);

		if (this.tags?.premium_subscriber === null) this.tags.premium_subscriber = true;
	}
}

export default Role;
