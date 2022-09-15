import Client from "../../Client";

export default class UserSettings {
	public client: Client;

	public data: UserSettings;

	constructor(client: Client, data: any) {
		this.client = client;

		this.data = data;
	}

	public async fetch(): Promise<UserSettings> {
		const data = await this.client.apiFetch("/users/@me/settings");
		this.data = data;
		return this.data;
	}

	public async push() {
		return await this.client.apiFetch("/users/@me/settings", {
			method: "PATCH",
			body: JSON.stringify(this.data)
		});
	}
}
