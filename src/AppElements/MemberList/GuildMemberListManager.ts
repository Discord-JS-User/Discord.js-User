import Guild from "../../Classes/Guild";
import Client from "../../Client";
import ChannelMemberListManager from "./ChannelMemberListManager";

class GuildMemberListManager {
	public client: Client;
	public guild: Guild;

	public id: string;
	public name: string;

	public channels: Array<ChannelMemberListManager> = [];

	constructor(client: Client, guild: Guild) {
		this.client = client;
		this.guild = guild;
		this.id = guild.id;
		this.name = guild.name;
		this.channels = this.guild.channels.cache.map(c => new ChannelMemberListManager(this.client, this.guild, c));
	}

	private async awaitChannels() {
		clearInterval(
			await new Promise(res => {
				if (this.guild.channels.cache.length > 0) res(null);
				const intervalID = setInterval(async () => {
					if (this.guild.channels.cache.length > 0) res(intervalID);
				}, 50);
			})
		);
		this.guild.channels.cache.forEach(channel => {
			if (!this.channels.find(i => i.id == channel.id)) this.channels.push(new ChannelMemberListManager(this.client, this.guild, channel));
		});
	}

	public async sync(op) {
		if (op.id == "everyone") op.id = 0;
		await this.awaitChannels();
		for (var channel of this.channels.filter(i => i.list_id == op.id)) {
			await channel.sync(op);
		}
		return;
	}

	public async update(op) {
		if (op.id == "everyone") op.id = 0;
		await this.awaitChannels();
		for (var channel of this.channels.filter(i => i.list_id == op.id)) {
			await channel.update(op);
		}
		return;
	}

	public async insert(op) {
		if (op.id == "everyone") op.id = 0;
		await this.awaitChannels();
		for (var channel of this.channels.filter(i => i.list_id == op.id)) {
			await channel.insert(op);
		}
		return;
	}

	public async delete(op) {
		if (op.id == "everyone") op.id = 0;
		await this.awaitChannels();
		for (var channel of this.channels.filter(i => i.list_id == op.id)) {
			await channel.delete(op);
		}
		return;
	}
}

export default GuildMemberListManager;
