import ChannelMemberListManager from "../../AppElements/MemberList/ChannelMemberListManager";
import BaseChannel from "../../BaseClasses/BaseChannel";
import Client from "../../Client";
import { GuildMemberSyncOptions } from "../../Types";
import Guild from "../Guild";
import GuildCategory from "./GuildCategory";

class GuildChannel extends BaseChannel {
	public guild: Guild;
	public parent?: GuildCategory;
	public position: number;
	public memberList: ChannelMemberListManager;

	constructor(client: Client, data: any, guild: Guild) {
		super(client, data);
		this.guild = guild;
		if (data.parent) this.parent = data.constructor.name == "GuildCategory" ? data.parent : new GuildCategory(this.client, data.parent, this.guild);
		this.position = data.position;
		this.memberList = this.guild.memberList.channels.find(i => i.id == this.id);
	}

	public async syncMemberList(rangeStart: number, rangeEnd: number, options: GuildMemberSyncOptions = {}) {
		this.memberList = this.guild.memberList.channels.find(i => i.id == this.id);
		this.client.sendMessage({
			op: 14,
			d: {
				guild_id: this.guild.id,
				...options,
				members: [],
				channels: { [this.id]: [[rangeStart, rangeEnd]] },
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
		return this.client.memberList.guilds?.find(i => i.id == this.guild?.id)?.channels?.find(i => i.id == this.id);
	}
}

export default GuildChannel;
