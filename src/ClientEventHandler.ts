import ClientUser from "./Classes/ClientUser";
import GuildMember from "./Classes/GuildMember";
import Role from "./Classes/Role";
import Client from "./Client";
import Logger from "./Logger";
import GuildManager from "./Managers/GuildManager";
import { genGatewayURL, wait } from "./utils";

export default class ClientEventHandler {
	public client: Client;
	public Logger: Logger;

	constructor(client: Client) {
		this.client = client;
		this.Logger = this.client.Logger;
	}

	public async READY(data) {
		this.client.readyData = data.d;
		this.client.user = new ClientUser(this.client, data.d);
		this.client.session_id = data.d.session_id;
		this.client.gatewayURL = genGatewayURL(data.d.resume_gateway_url, {
			v: "10",
			encoding: this.client.encryptor.enabled ? "etf" : "json",
			...(this.client.compressor.enabled ? { compress: "zlib-stream" } : {})
		});
		this.client.guilds = new GuildManager(this.client, data.d.guilds);
		for (const [_, guild] of this.client.guilds.cache) {
			await guild.channels.fetch();
			await wait(30);
		}
		for (const userData of data.d.users) {
			this.client.createUser(userData);
		}
	}

	public RESUMED(data) {
		this.Logger.log("Resumed Successfully", data);
	}

	public async PRESENCE_UPDATE(data) {
		// ONLY BECAUSE USERS ARE NOT SETUP YET, SO CURRENTLY ONLY UPDATING GUILD MEMBERS
		if (!data.d.guild_id) return null;
		const members = this.client.guilds.cache.find(i => i.id == data.d.guild_id).members;
		if (!members.cache.find(i => i.id == data.d.user.id)) await members.fetch(data.d.user.id);
		members.cache.find(i => i.id == data.d.user.id)._updatePresence(data.d);
		return members.cache.find(i => i.id == data.d.user.id);
	}

	public SESSIONS_REPLACE(data) {
		return this.client.user.sessions._update(data.d);
	}

	public CHANNEL_CREATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		guild.channels.pushToCache(data.d);
		return guild.channels.cache.find(i => i.id == data.d.id);
	}
	public CHANNEL_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		guild.channels.pushToCache(data.d);
		return guild.channels.cache.find(i => i.id == data.d.id);
	}
	public CHANNEL_DELETE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		return guild.channels.remove(guild.channels.cache.find(i => i.id == data.d.id));
	}

	public GUILD_CREATE(data) {
		return this.client.guilds.push(data.d);
	}
	public GUILD_UPDATE(data) {
		return this.client.guilds.push(data.d);
	}
	public GUILD_DELETE(data) {
		if (data.d.unavailable) {
			return this.client.guilds.push(data.d);
		} else {
			return this.client.guilds.remove(data.d);
		}
	}
	public GUILD_BAN_ADD(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		const ban = data.d;
		ban.user = this.client.createUser(ban);
		return { guild, ban: guild.bans.push(ban) };
	}
	public GUILD_BAN_REMOVE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		return { guild, ban: guild.bans.remove(data.d) };
	}
	public GUILD_EMOJIS_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		guild.emojis = data.d.emojis.map(i => {
			i.url = `https://cdn.discordapp.com/emojis/${i.id}.${i.animated ? "gif" : "png"}`;
			return i;
		});
		return guild;
	}
	public GUILD_STICKERS_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		guild.stickers = data.d.stickers.map(s => {
			if (s.user) s.user = this.client.createUser(s.user);
			return s;
		});
		return guild;
	}
	public GUILD_MEMBER_ADD(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		const member = new GuildMember(this.client, guild, data.d);
		guild.members.pushToCache([member]);
		return member;
	}
	public GUILD_MEMBER_REMOVE(data) {
		return this.client.guilds.cache.find(i => i.id == data.d.guild_id).members.removeFromCache(this.client.createUser(data.d.user));
	}
	public GUILD_MEMBER_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		const member = new GuildMember(this.client, guild, data.d);
		guild.members.pushToCache(member);
		return member;
	}
	public GUILD_ROLE_CREATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		return guild.roles.push(new Role(this.client, guild, data.d.role));
	}
	public GUILD_ROLE_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		return guild.roles.push(new Role(this.client, guild, data.d.role));
	}
	public GUILD_ROLE_DELETE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		return guild.roles.remove(guild.roles.cache.find(i => i.id == data.d.role_id));
	}
	public GUILD_SCHEDULED_EVENT_CREATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		data.d.guild = guild;
		data.d.subscribers = [];
		guild.scheduled_events.push(data.d);
		return data.d;
	}
	public GUILD_SCHEDULED_EVENT_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		data.d.guild = guild;
		data.d.subscribers = [];
		guild.scheduled_events.push(data.d);
		return data.d;
	}
	public GUILD_SCHEDULED_EVENT_DELETE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		data.d.guild = guild;
		data.d.subscribers = [];
		const item = guild.scheduled_events.find(i => i.id == data.d.id);
		if (!item) return data.d;
		guild.scheduled_events.remove(item);
		return item;
	}
	public async GUILD_SCHEDULED_EVENT_USER_ADD(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		const event = guild.scheduled_events.find(i => i.id == data.d.guild_scheduled_event_id);
		if (!event) return null;
		const user = await this.client.getUser(data.d.user_id);
		guild.scheduled_events.get(event.id).subscribers.push(user);
		return user;
	}
	public async GUILD_SCHEDULED_EVENT_USER_REMOVE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.d.guild_id);
		const event = guild.scheduled_events.find(i => i.id == data.d.guild_scheduled_event_id);
		if (!event) return null;
		const user = await this.client.getUser(data.d.user_id);
		const subscribers = guild.scheduled_events.get(event.id).subscribers;
		if (!subscribers.find(i => i.id == user.id)) return user;
		return guild.scheduled_events.get(event.id).subscribers.splice(subscribers.indexOf(subscribers.find(i => i.id == user.id)), 1)[0];
	}
}
