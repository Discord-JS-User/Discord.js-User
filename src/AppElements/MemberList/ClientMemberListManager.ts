import Guild from "../../Classes/Guild";
import Client from "../../Client";
import GuildMemberListManager from "./GuildMemberListManager";

class ClientMemberListManager {
	public client: Client;

	public guilds: Array<GuildMemberListManager> = [];

	constructor(client: Client) {
		this.client = client;
	}

	public loadGuild(guild: Guild) {
		this.guilds.push(new GuildMemberListManager(this.client, guild));
	}

	public async sync(op) {
		return await this.guilds.find(i => i.id == op.guild_id).sync(op);
	}

	public async update(op) {
		return await this.guilds.find(i => i.id == op.guild_id).update(op);
	}

	public async insert(op) {
		return await this.guilds.find(i => i.id == op.guild_id).insert(op);
	}

	public async delete(op) {
		return await this.guilds.find(i => i.id == op.guild_id).delete(op);
	}
}

export default ClientMemberListManager;
