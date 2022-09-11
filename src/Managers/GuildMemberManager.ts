import Guild from "../Classes/Guild";
import GuildMember from "../Classes/GuildMember";
import Client from "../Client";
import { GuildMemberSyncOptions } from "../Types";

class GuildMemberManager {
	public client: Client;
	public guild: Guild;

	public cache: Array<GuildMember> = [];

	constructor(client: Client, guild: Guild) {
		this.client = client;
		this.guild = guild;
	}

	public async syncMemberList(channels: { [id: string]: Array<[number, number]> } = {}, options: GuildMemberSyncOptions = {}) {
		this.client.sendMessage({
			op: 14,
			d: {
				guild_id: this.guild.id,
				...options,
				members: [],
				channels,
				thread_member_lists: []
			}
		});
		await new Promise(res => {
			this.client.on("guild_member_list_update", () => res(null));
		});
		this.client.removeListener(
			"guild_member_list_update",
			this.client.listeners("guild_member_list_update").find(i => i.toString() == "() => res(null)")
		);
		return this.client.memberList.guilds?.find(i => i.id == this.guild?.id);
	}
}

export default GuildMemberManager;
