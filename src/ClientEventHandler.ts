import ClientUser from "./Classes/ClientUser";
import GuildMember from "./Classes/GuildMember";
import Role from "./Classes/Role";
import Client from "./Client";
import Logger from "./Logger";
import GuildManager from "./Managers/GuildManager";
import { genGatewayURL, wait } from "./utils";

// FIND `TYPING_START` EVENT AND USE ACTUAL CHANNELS AFTER SETTING UP PRIVATE CHANNELS

export default class ClientEventHandler {
	public client: Client;
	public Logger: Logger;

	constructor(client: Client) {
		this.client = client;
		this.Logger = this.client.Logger;
	}

	public async READY(data) {
		this.client.readyData = data;
		this.client.user = new ClientUser(this.client, data);
		this.client.session_id = data.session_id;
		this.client.gatewayURL = genGatewayURL(data.resume_gateway_url, {
			v: "10",
			encoding: this.client.encryptor.enabled ? "etf" : "json",
			...(this.client.compressor.enabled ? { compress: "zlib-stream" } : {})
		});
		this.client.guilds = new GuildManager(this.client, data.guilds);
		for (const [_, guild] of this.client.guilds.cache) {
			await guild.channels.fetch();
			await wait(30);
		}
		for (const userData of data.users) {
			this.client.createUser(userData);
		}
	}

	public RESUMED() {
		this.Logger.log("Resumed Successfully");
	}

	public USER_SETTINGS_UPDATE(data) {
		this.client.user.settings.update(data);
		return this.client.user.settings;
	}
	public USER_GUILD_SETTINGS_UPDATE(data) {
		this.client.user.guild_settings.update(data);
		return this.client.user.guild_settings;
	}

	public TYPING_START(data) {
		// CHANGE TO ACTUAL CHANNELS AFTER SETTING UP PRIVATE CHANNELS
		this.client.users
			.find(i => i.id == data.user_id)
			.presence._setTypingState({
				typing: true,
				channel: data.channel_id
			});
		return this.client.users.find(i => i.id == data.user_id);
	}

	public async PRESENCE_UPDATE(data) {
		if (!data.guild_id) {
			const user = await this.client.getUser(data.user.id);
			this.client.users.find(i => i.id == user.id)._updatePresence(data);
			return this.client.users.find(i => i.id == user.id);
		}
		const members = this.client.guilds.cache.find(i => i.id == data.guild_id).members;
		if (!members.cache.find(i => i.id == data.user.id)) await members.fetch(data.user.id);
		members.cache.find(i => i.id == data.user.id)._updatePresence(data);
		return members.cache.find(i => i.id == data.user.id);
	}

	public SESSIONS_REPLACE(data) {
		return this.client.user.sessions.update(data);
	}

	public CHANNEL_CREATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		guild.channels.pushToCache(data);
		return guild.channels.cache.find(i => i.id == data.id);
	}
	public CHANNEL_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		guild.channels.pushToCache(data);
		return guild.channels.cache.find(i => i.id == data.id);
	}
	public CHANNEL_DELETE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		return guild.channels.remove(guild.channels.cache.find(i => i.id == data.id));
	}

	public GUILD_CREATE(data) {
		return this.client.guilds.push(data);
	}
	public GUILD_UPDATE(data) {
		return this.client.guilds.push(data);
	}
	public GUILD_DELETE(data) {
		if (data.unavailable) {
			return this.client.guilds.push(data);
		} else {
			return this.client.guilds.remove(data);
		}
	}
	public GUILD_BAN_ADD(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		const ban = data;
		ban.user = this.client.createUser(ban);
		return { guild, ban: guild.bans.push(ban) };
	}
	public GUILD_BAN_REMOVE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		return { guild, ban: guild.bans.remove(data) };
	}
	public GUILD_EMOJIS_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		guild.emojis = data.emojis.map(i => {
			i.url = `https://cdn.discordapp.com/emojis/${i.id}.${i.animated ? "gif" : "png"}`;
			return i;
		});
		return guild;
	}
	public GUILD_STICKERS_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		guild.stickers = data.stickers.map(s => {
			if (s.user) s.user = this.client.createUser(s.user);
			return s;
		});
		return guild;
	}
	public GUILD_MEMBER_ADD(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		const member = new GuildMember(this.client, guild, data);
		guild.members.pushToCache([member]);
		return member;
	}
	public GUILD_MEMBER_REMOVE(data) {
		return this.client.guilds.cache.find(i => i.id == data.guild_id).members.removeFromCache(this.client.createUser(data.user));
	}
	public GUILD_MEMBER_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		const member = new GuildMember(this.client, guild, data);
		guild.members.pushToCache(member);
		return member;
	}
	public GUILD_ROLE_CREATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		return guild.roles.push(new Role(this.client, guild, data.role));
	}
	public GUILD_ROLE_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		return guild.roles.push(new Role(this.client, guild, data.role));
	}
	public GUILD_ROLE_DELETE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		return guild.roles.remove(guild.roles.cache.find(i => i.id == data.role_id));
	}
	public GUILD_SCHEDULED_EVENT_CREATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		data.guild = guild;
		data.subscribers = [];
		guild.scheduled_events.push(data);
		return data;
	}
	public GUILD_SCHEDULED_EVENT_UPDATE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		data.guild = guild;
		data.subscribers = [];
		guild.scheduled_events.push(data);
		return data;
	}
	public GUILD_SCHEDULED_EVENT_DELETE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		data.guild = guild;
		data.subscribers = [];
		const item = guild.scheduled_events.find(i => i.id == data.id);
		if (!item) return data;
		guild.scheduled_events.remove(item);
		return item;
	}
	public async GUILD_SCHEDULED_EVENT_USER_ADD(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		const event = guild.scheduled_events.find(i => i.id == data.guild_scheduled_event_id);
		if (!event) return null;
		const user = await this.client.getUser(data.user_id);
		guild.scheduled_events.get(event.id).subscribers.push(user);
		guild.scheduled_events.get(event.id).user_count += 1;
		return user;
	}
	public async GUILD_SCHEDULED_EVENT_USER_REMOVE(data) {
		const guild = this.client.guilds.cache.find(i => i.id == data.guild_id);
		const event = guild.scheduled_events.find(i => i.id == data.guild_scheduled_event_id);
		if (!event) return null;
		const user = await this.client.getUser(data.user_id);
		const subscribers = guild.scheduled_events.get(event.id).subscribers;
		if (!subscribers.find(i => i.id == user.id)) return user;
		guild.scheduled_events.get(event.id).user_count -= 1;
		return guild.scheduled_events.get(event.id).subscribers.splice(subscribers.indexOf(subscribers.find(i => i.id == user.id)), 1)[0];
	}
}
