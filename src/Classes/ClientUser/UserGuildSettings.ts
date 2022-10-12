import Client from "../../Client";
import { UserGuildSettingsItem, UserGuildSettingsObject } from "../../Types";

/** Guild Settings for the Client User */
export default class UserGuildSettings {
	/** The Client */
	public client: Client;

	/** The Settings */
	public data: UserGuildSettingsObject;

	/**
	 * Guild Settings for the Client User
	 * @param client The Client
	 * @param data The Settings
	 */
	constructor(client: Client, data: any) {
		this.client = client;
		this.data = data;
	}

	/**
	 * Update the data for a Single Guild
	 * @param data The Guild Data
	 */
	public update(data: UserGuildSettingsItem) {
		this.data.entries[this.data.entries.findIndex(i => i.guild_id == data.guild_id)] = {
			...this.data.entries[this.data.entries.findIndex(i => i.guild_id == data.guild_id)],
			...data
		};
		return this.data.entries[this.data.entries.findIndex(i => i.guild_id == data.guild_id)];
	}

	/**
	 * Push the settings to the API
	 * @param guild_id The Guild ID To Push
	 * @returns The return data from the request
	 */
	public async push(guild_id: string) {
		if (!guild_id) throw new Error("NO GUILD ID SPECIFIED");
		const data: any = this.data.entries.find(i => i.guild_id == guild_id);
		const overrideStore = data.channel_overrides;
		data.channel_overrides = {};
		for (const override of overrideStore) {
			data.channel_overrides[override.channel_id] = override;
		}
		return this.update(
			await this.client.apiFetch(`/users/@me/guilds/${guild_id}/settings`, {
				method: "PATCH",
				body: JSON.stringify(data)
			})
		);
	}
}
