import Client from "../../Client";
import Guild from "../../Classes/Guild";
import { ChannelTypesEnum, MemberListCategoryDisplayData } from "../../Types";
import ChannelMemberListCategory from "./ChannelMemberListCategory";
import { getChannelListID } from "../../utils";
import GuildMember from "../../Classes/GuildMember";

class ChannelMemberListManager {
	public client: Client;
	public guild: Guild;
	public channel: ChannelTypesEnum[keyof ChannelTypesEnum];

	public list_id: number;
	public id: string;
	public name: string;

	public categories: Array<ChannelMemberListCategory> = [];

	constructor(client: Client, guild: Guild, channel: ChannelTypesEnum[keyof ChannelTypesEnum]) {
		this.client = client;
		this.guild = guild;
		this.channel = channel;
		this.id = channel.id;
		this.name = channel.name;
		this.list_id = getChannelListID(this.channel);
	}

	public async sync(op) {
		let category =
			this.categories[this.categories.length - 1] ||
			new ChannelMemberListCategory(this.client, this.guild, this.channel, 0, {
				name: "",
				id: "",
				color: 0,
				members: []
			});
		for (var item of op.items) {
			if (item.group || op.items.indexOf(item) == op.items.length - 1) {
				if (category.displayData.id !== "") {
					if (this.categories.find(i => i.displayData.id == category.displayData.id)) {
						this.categories[this.categories.indexOf(this.categories.find(i => i.displayData.id == category.displayData.id))] = category;
					} else {
						this.categories.push(category);
					}
				}
				if (op.items.indexOf(item) != op.items.length - 1)
					category = new ChannelMemberListCategory(this.client, this.guild, this.channel, item.group.count, {
						name: item.group.id == "online" ? "online" : item.group.id == "offline" ? "offline" : this.guild.roles.cache.find(i => i.id == item.group.id)?.name,
						id: item.group.id,
						color: item.group.id == "online" || item.group.id == "offline" ? 10070709 : this.guild.roles.cache.find(i => i.id == item.group.id)?.color,
						members: []
					});
			} else if (item.member) {
				category.members.push(new GuildMember(this.client, this.guild, item.member));
			}
		}
		return;
	}

	public async update(op) {
		if (op.item.group) this.categories.find(i => i.id == op.item.group.id)._setCount(op.item.group.count);
		else if (op.item.member)
			for (const category of this.categories) {
				const member = category.members.find(i => i.id == op.item.member.user.id);
				if (member) {
					category._updateMember(new GuildMember(this.client, this.guild, op.item.member));
				}
			}
	}

	public async insert(op) {
		const targetIndex = op.index;
		let index = 0;
		for (const category of this.categories) {
			if (op.item.group && index == targetIndex) {
				const newCategory = new ChannelMemberListCategory(this.client, this.guild, this.channel, op.item.group.count, {
					name: op.item.group.id == "online" ? "online" : op.item.group.id == "offline" ? "offline" : this.guild.roles.cache.find(i => i.id == op.item.group.id)?.name,
					id: op.item.group.id,
					color: op.item.group.id == "online" || op.item.group.id == "offline" ? 10070709 : this.guild.roles.cache.find(i => i.id == op.item.group.id)?.color,
					members: []
				});
				this.categories.splice(this.categories.indexOf(category), 0, newCategory);
				return newCategory;
			}
			index += 1;
			for (const member of category.members) {
				if (op.item.member && index == targetIndex) {
					const newMember = new GuildMember(this.client, this.guild, op.item.member);
					category._insertMember(newMember, category.members.indexOf(member));
					return newMember;
				}
				index += 1;
			}
		}
	}

	public async delete(op) {
		const targetIndex = op.index;
		let index = 0;
		for (const category of this.categories) {
			if (index == targetIndex) {
				this.categories.splice(this.categories.indexOf(category), 1);
				return category;
			}
			index += 1;
			for (const member of category.members) {
				if (index == targetIndex) {
					category._deleteMember(category.members.indexOf(member));
					return member;
				}
				index += 1;
			}
		}
	}
}

export default ChannelMemberListManager;
