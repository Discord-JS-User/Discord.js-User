import Client from "../../Client";
import Guild from "../../Classes/Guild";
import { ChannelTypesEnum } from "../../Types";
import GuildMember from "../../Classes/GuildMember";
import { MemberListCategoryDisplayData } from "../../Types";

class ChannelMemberListCategory {
	public client: Client;
	public guild: Guild;
	public channel: ChannelTypesEnum[keyof ChannelTypesEnum];

	public count: number;
	public displayData: MemberListCategoryDisplayData;
	public id: string;
	public members: Array<GuildMember>;

	constructor(client: Client, guild: Guild, channel: ChannelTypesEnum[keyof ChannelTypesEnum], count: number, displayData: MemberListCategoryDisplayData) {
		this.client = client;
		this.guild = guild;
		this.channel = channel;
		this.count = count;
		this.members = displayData.members;
		delete displayData.members;
		this.id = displayData.id;
		this.displayData = displayData;
	}

	public _setCount(count: number) {
		this.count = count;
	}

	public _updateMember(member: GuildMember) {
		this.members[this.members.indexOf(this.members.find(i => i.id == member.id))] = member;
	}

	public _insertMember(member: GuildMember, index: number) {
		this.members.splice(index, 0, member);
	}

	public _deleteMember(index: number) {
		this.members.splice(index, 1);
	}
}

export default ChannelMemberListCategory;
