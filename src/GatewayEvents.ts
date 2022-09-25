import Session from "./Classes/ClientUser/Session";
import WebSocket from "ws";
import GuildMember from "./Classes/GuildMember";
import Guild from "./Classes/Guild";
import { BanObject, ChannelType, GuildScheduledEvent } from "./Types";
import Role from "./Classes/Role";
import User from "./Classes/User";
import { Collection } from "@djs-user/utility";

/** The Events that the Client can Send */
type GatewayEvents = {
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

	channel_create: (channel: ChannelType) => void;
	channel_update: (channel: ChannelType) => void;
	channel_delete: (channel: ChannelType) => void;

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
};

export default GatewayEvents;
