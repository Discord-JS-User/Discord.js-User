import Session from "./Classes/ClientUser/Session";
import WebSocket from "ws";
import GuildMember from "./Classes/GuildMember";
import Guild from "./Classes/Guild";
import { BanObject, GuildScheduledEvent } from "./Types";
import Role from "./Classes/Role";
import User from "./Classes/User";
import { Channel } from "diagnostics_channel";
import { Collection } from "@discord.js-user/utility";

/** The events for the Client Connection */
export default interface GatewayEvents {
	open: (openEvent: WebSocket.Event) => void;
	close: (closeEvent: WebSocket.CloseEvent) => void;
	disconnect: () => void;
	error: (error: WebSocket.ErrorEvent) => void;
	message: (data: any) => void;
	heartbeatSend: () => void;
	heartbeatAck: () => void;
	ready: (readyData: object) => void;
	sessions_replace: (sessions: Collection<Session>) => void;
	presence_update: (member: GuildMember) => void;

	channel_create: (channel: Channel) => void;
	channel_update: (channel: Channel) => void;
	channel_delete: (channel: Channel) => void;

	guild_create: (guild: Guild) => void;
	guild_update: (guild: Guild) => void;
	guild_remove: (guild: Guild) => void;

	guild_ban_add: (data: { guild: Guild; ban: BanObject }) => void;
	guild_ban_remove: (data: { guild: Guild; ban: BanObject }) => void;

	guild_emojis_update: (guild: Guild) => void;
	guild_stickers_update: (guild: Guild) => void;

	guild_member_add: (member: GuildMember) => void;
	guild_member_remove: (member: GuildMember) => void;
	guild_member_update: (member: GuildMember) => void;

	guild_role_create: (role: Role) => void;
	guild_role_update: (role: Role) => void;
	guild_role_remove: (role: Role) => void;

	guild_scheduled_event_create: (event: GuildScheduledEvent) => void;
	guild_scheduled_event_update: (event: GuildScheduledEvent) => void;
	guild_scheduled_event_delete: (event: GuildScheduledEvent) => void;
	guild_scheduled_event_user_add: (user: User | null) => void;
	guild_scheduled_event_user_remove: (user: User | null) => void;
}
