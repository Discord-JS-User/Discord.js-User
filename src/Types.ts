import WebSocket from "ws";
import User from "./Classes/User";
import GuildCategory from "./Classes/Channels/GuildCategory";
import GuildTextChannel from "./Classes/Channels/Specific/GuildTextChannel";
import GuildVoiceChannel from "./Classes/Channels/Specific/GuildVoiceChannel";
import GuildAnnouncementChannel from "./Classes/Channels/Specific/GuildAnnouncementChannel";
import GuildStageChannel from "./Classes/Channels/Specific/GuildStageChannel";
import GuildForumChannel from "./Classes/Channels/Specific/GuildForumChannel";
import GuildMember from "./Classes/GuildMember";
import ChannelMemberListManager from "./AppElements/MemberList/ChannelMemberListManager";

export type GatewayEvents = {
	/** The Client has opened the Gateway Connection */
	open: (openEvent: WebSocket.Event) => void;
	/** The Gateway Connection has been closed */
	close: (closeEvent: WebSocket.CloseEvent) => void;
	/** The Client has disconnected using the `disconnect()` function */
	disconnect: () => void;
	/** The Gateway Connection experienced an Error */
	error: (error: WebSocket.ErrorEvent) => void;
	/** (RAW DATA) The Gateway Connection recieved a message */
	message: (data: any) => void;
	/** The Client has recieved the READY event and is prepared to start operations */
	ready: (readyData: Object) => void;
	/** The memmber list of a guild has been updated (Passes an array of the updated channels) */
	guild_member_list_update: (data: ChannelMemberListManager[]) => void;
};

export interface SessionData {
	client_state: {
		guild_hashes: Object;
		highest_last_message_id: string;
		read_state_version: number;
		user_guild_settings_version: number;
	};
	properties: {
		os: "iOS" | "Mac OS X" | string;
		browser: "Discord Desktop" | "Discord Android";
		release_channel: string;
		system_locale: string;
	};
	presence: {
		activites: Array<Object>;
		afk: boolean;
		since: number;
		status: PresenceStatus;
	};
}

export interface ClientLoginOptions {
	/**
	 * Enable Debug Logging
	 */
	debug: boolean;
}

export interface CustomStatus {
	name?: string;
	state: string;
	emoji?: ActivityEmoji;
	type?: number;
}

export type PresenceStatus = "online" | "offline" | "idle" | "dnd" | "invisible";

export type GuildMemberListSyncItem = {} | {};

export interface GuildMemberListData {
	ops: [
		{
			op: "SYNC" | "UPDATE" | "INSERT" | "DELETE" | "INVALIDATE";
			range?: [[number, number]];
			items?: [GuildMemberListSyncItem];
			index?: number;
			item: GuildMemberListSyncItem;
		}
	];
	online_count: number;
	member_count: number;
	id: string;
	guild_id: string;
	groups: Array<{ id: string | "online" | "offline"; count: number }>;
}

export interface APIFetchOptions {
	method?: string;
	queryParams?: Array<string>;
}

export enum ActivityType {
	"GAME" = 0,
	"STREAMING" = 1,
	"LISTENING" = 2,
	"WATCHING" = 3,
	"CUSTOM" = 4,
	"COMPETING" = 5
}

export interface ActivityEmoji {
	name: string;
	id: string;
	animated: boolean;
	url: string;
}

export interface PresenceData {
	name: string;
	id: string | "custom";
	type: ActivityType;
	url?: string;
	created_at: Date;
	timestamps?: {
		start?: Date;
		end?: Date;
	};
	application_id?: string;
	details?: string;
	state?: string;
	emoji?: ActivityEmoji;
	party?: {
		id?: string;
		size?: [number, number];
	};
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	secrets?: {
		join?: string;
		spectate?: string;
		match?: string;
	};
	instance?: boolean;
	flags?: number;
	buttons?: Array<{
		label?: string;
		url?: string;
	}>;
}

export type GuildFeature = "ANIMATED_BANNER" | "ANIMATED_ICON" | "AUTO_MODERATION" | "BANNER" | "COMMUNITY" | "DISCOVERABLE" | "FEATURABLE" | "INVITE_SPLASH" | "MEMBER_VERIFICATION_GATE_ENABLED" | "MONETIZATION_ENABLED" | "MORE_STICKERS" | "NEWS" | "PARTNERED" | "PREVIEW_ENABLED" | "PRIVATE_THREADS" | "ROLE_ICONS" | "TICKETED_EVENTS_ENABLED" | "VANITY_URL" | "VERIFIED" | "VIP_REGIONS" | "WELCOME_SCREEN_ENABLED";

export enum GuildScheduledEventStatus {
	"SCHEDULED" = 1,
	"ACTIVE" = 2,
	"COMPLETED" = 3,
	"CANCELED" = 4
}
export enum GuildScheduledEventType {
	"STAGE_INSTANCE" = 1,
	"VOICE" = 2,
	"EXTERNAL" = 3
}
export interface GuildScheduledEvent {
	id: string;
	guild_id: string;
	channel_id: string;
	creator_id?: string;
	name: string;
	description?: string;
	scheduled_start_time: string;
	scheduled_end_time: string;
	privacy_level: 2;
	status: GuildScheduledEventStatus;
	entity_type: GuildScheduledEventType;
	entity_id: string;
	entity_metadata: {
		location?: string;
	};
	creator?: User;
	user_count?: number;
	image?: string;
}

export interface Sticker {
	id: string;
	pack_id?: string;
	name: string;
	description: string;
	tags: string;
	asset?: string;
	type: number;
	format_type: number;
	available?: boolean;
	guild_id?: string;
	user?: User;
	sort_value?: number;
}

export enum GuildNSFWLevel {
	"DEFAULT" = 0,
	"EXPLICIT" = 1,
	"SAFE" = 2,
	"AGE_RESTRICTED" = 3
}

export interface Emoji {
	id: string;
	name: string;
	roles?: Array<string>;
	user?: User;
	require_colons: boolean;
	managed?: boolean;
	animated?: boolean;
	available?: boolean;
	url: string;
}

export interface ChannelPermissionOverwrite {
	id: string;
	type: 0 | 1;
	allow: string;
	deny: string;
}

export interface ThreadMetaData {
	archived: boolean;
	auto_archive_duration: number;
	archive_timestamp: number;
	locked: boolean;
	invitable?: boolean;
	create_timestamp?: number;
}

export interface ThreadMember {
	id?: string;
	user_id?: string;
	join_timestamp: number;
	flags: number;
}

export const ChannelTypes = {
	0: GuildTextChannel,
	2: GuildVoiceChannel,
	4: GuildCategory,
	5: GuildAnnouncementChannel,
	13: GuildStageChannel,
	15: GuildForumChannel
};

export type ChannelTypesEnum = {
	0: GuildTextChannel;
	2: GuildVoiceChannel;
	4: GuildCategory;
	5: GuildAnnouncementChannel;
	13: GuildStageChannel;
	15: GuildForumChannel;
};

export interface GuildMemberSyncOptions {
	typing?: boolean;
	threads?: boolean;
	activities?: boolean;
}

export interface MemberListCategoryDisplayData {
	name: string;
	id: string;
	color: number;
	members: Array<GuildMember>;
}

export interface GatewayEventFormat {
	op: number;
	d?: any;
	s?: number;
	t?: any;
}
