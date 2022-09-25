import Client from "../Client";
import { RoleTags } from "../Types";
import { fillClassValues } from "../utils";
import Guild from "./Guild";

/** A Role */
export default class Role {
	/** The Client */
	public client: Client;
	/** The Guild the Role is in */
	public guild: Guild;

	/** The Role ID */
	public id: string;
	/** The Role Name */
	public name: string;
	/** The Role Color */
	public color: number;
	/** Whether the Role should be displayed as another category in the member list */
	public hoist: boolean;
	/** The Role Icon Hash */
	public icon?: string;
	/** THe Role Emoji */
	public emoji?: string;
	/** The Role Position */
	public position: number;
	/** A permissions Bit Set for the Role */
	public permissions: string;
	/** Whether the Role is managed by an Integration */
	public managed: boolean;
	/** Whether the Client can mention the Role */
	public mentionable: boolean;
	/** Tags for the role */
	public tags?: RoleTags;

	/**
	 * A Role
	 * @param client The Client
	 * @param guild The Guild the Role is in
	 * @param data Data to fill
	 */
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
