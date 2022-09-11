import Client from "../Client";
import { fillClassValues } from "../utils";

class User {
	public client: Client;

	public id: string;
	public username: string;
	public discriminator: string;
	public avatar?: string;
	public bot: boolean;
	public system: boolean;
	public mfa?: boolean;
	public banner?: string;
	public accent_color?: number;
	public locale?: string;
	public verified?: boolean;
	public email?: string;
	public flags?: number;
	public public_flags?: number;
	public nitro_level: 0 | 1 | 2;

	constructor(client: Client, data: any) {
		this.client = client;
		this.setup(data);
	}

	private setup(data: any) {
		const aliases = {
			nitro_type: "premium_type",
			mfa: "mfa_enabled"
		};
		const parsers = {
			bot: i => !!i,
			system: i => !!i,
			nitro_level: i => i || 0
		};
		fillClassValues(this, data, aliases, parsers);
	}

	public async fetch(): Promise<{ [key: string]: any }> {
		const data = await this.client.apiFetch(`/users/${this.id}`);

		this.setup(data);

		return data;
	}
}

export default User;
