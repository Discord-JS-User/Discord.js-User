import Client from "../Client";
import { DiscordNitroLevel } from "../Types";
import { fillClassValues } from "../utils";

/** A User */
class User {
	/** The Client */
	public client: Client;

	/** The User ID */
	public id: string;
	/** The User Username */
	public username: string;
	/** The User Discriminator (4-Digit Discord Tag) */
	public discriminator: string;
	/** The User's Avatar Hash */
	public avatar?: string;
	/** Whether the User is a Bot */
	public bot: boolean;
	/** Whether the User is an Official Discord System Bot */
	public system: boolean;
	/** Whether the User has 2FA enabled */
	public mfa?: boolean;
	/** The User's Banner Hash */
	public banner?: string;
	/** The User's Accent Color */
	public accent_color?: number;
	/** THe User's chosen language */
	public locale?: string;
	/** Whether the User's email has been verified */
	public verified?: boolean;
	/** The User's email */
	public email?: string;
	/** The flags on the User's account */
	public flags?: number;
	/** The public flags on the User's account */
	public public_flags?: number;
	/** The level of Discord Nitro the user has */
	public nitro_level: DiscordNitroLevel;
	/** The User's Bio */
	public bio: string;
	/** The User's Banner Color */
	public banner_color?: string;
	public avatar_decoration?: unknown;

	/**
	 * A User
	 * @param client The Client
	 * @param data Data to fill
	 */
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

	/**
	 * Fetch and Update the user from the API
	 * @returns The fetched data (not parsed to a User Class)
	 */
	public async fetch(): Promise<{ [key: string]: any }> {
		const data = await this.client.apiFetch(`/users/${this.id}`);

		this.setup(data);

		return data;
	}
}

export default User;
