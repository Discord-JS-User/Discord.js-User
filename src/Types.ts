import User from "./Classes/User";
import GuildCategory from "./Classes/Channels/GuildCategory";
import GuildTextChannel from "./Classes/Channels/Specific/GuildTextChannel";
import GuildVoiceChannel from "./Classes/Channels/Specific/GuildVoiceChannel";
import GuildAnnouncementChannel from "./Classes/Channels/Specific/GuildAnnouncementChannel";
import GuildStageChannel from "./Classes/Channels/Specific/GuildStageChannel";
import GuildForumChannel from "./Classes/Channels/Specific/GuildForumChannel";
import GuildMember from "./Classes/GuildMember";
import { BodyInit } from "node-fetch";
import Guild from "./Classes/Guild";
import GuildChannel from "./Classes/Channels/GuildChannel";
import BaseChannel from "./BaseClasses/BaseChannel";
import { PublicThreadChannel } from "./Classes/Channels/Specific/Threads/PublicThreadChannel";

/** Custom Status format */
export interface CustomStatus {
	name?: string;
	state: string;
	expires_at?: number;
	emoji?: ActivityEmoji;
	type?: number;
}

/** Statuses for presence */
export type PresenceStatus = "online" | "offline" | "idle" | "dnd" | "invisible";

/** A Item for a GuildMemberSync event (Either a Group or a RAW Guild Member Object) */
export type GuildMemberListSyncItem =
	| {
			group: { id: string | "offline" | "online"; count: number };
	  }
	| {
			member: {} /** RAW Guild Member Object */;
	  };

/** Data for a GuildMemberSync event */
export interface GuildMemberListData {
	ops: [
		{
			op: "SYNC" | "UPDATE" | "INSERT" | "DELETE" | "INVALIDATE";
			range?: [[number, number]];
			items?: [GuildMemberListSyncItem];
			index?: number;
			item?: GuildMemberListSyncItem;
		}
	];
	online_count: number;
	member_count: number;
	id: string;
	guild_id: string;
	groups: Array<{ id: string | "online" | "offline"; count: number }>;
}

/** Options for an API Fetch */
export interface APIFetchOptions {
	/**
	 * The Method for the request
	 */
	method?: string;
	/**
	 * Query Params for the request
	 */
	queryParams?: Array<string>;
	/**
	 * Body for the request
	 */
	body?: BodyInit;
}

/** Different Activity Types */
export enum ActivityType {
	"GAME" = 0,
	"STREAMING" = 1,
	"LISTENING" = 2,
	"WATCHING" = 3,
	"CUSTOM" = 4,
	"COMPETING" = 5
}

/** An emoji for an activity */
export interface ActivityEmoji {
	name: string;
	id: string;
	animated: boolean;
	url: string;
}

/** Data for a PresenceActivity */
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
	session_id?: string;
}

/** Guild Features */
export type GuildFeature = "ANIMATED_BANNER" | "ANIMATED_ICON" | "AUTO_MODERATION" | "BANNER" | "COMMUNITY" | "DISCOVERABLE" | "FEATURABLE" | "INVITE_SPLASH" | "MEMBER_VERIFICATION_GATE_ENABLED" | "MONETIZATION_ENABLED" | "MORE_STICKERS" | "NEWS" | "PARTNERED" | "PREVIEW_ENABLED" | "PRIVATE_THREADS" | "ROLE_ICONS" | "TICKETED_EVENTS_ENABLED" | "VANITY_URL" | "VERIFIED" | "VIP_REGIONS" | "WELCOME_SCREEN_ENABLED";

/** Statuses for Guild Events */
export enum GuildScheduledEventStatus {
	"SCHEDULED" = 1,
	"ACTIVE" = 2,
	"COMPLETED" = 3,
	"CANCELED" = 4
}
/** Types for Guild Events */
export enum GuildScheduledEventType {
	"STAGE_INSTANCE" = 1,
	"VOICE" = 2,
	"EXTERNAL" = 3
}
/** A Guild Event */
export interface GuildScheduledEvent {
	id: string;
	guild_id: string;
	guild: Guild;
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
	subscribers: User[];
}

/** A Sticker */
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

/** A NSFW Level for a Guild */
export enum GuildNSFWLevel {
	"DEFAULT" = 0,
	"EXPLICIT" = 1,
	"SAFE" = 2,
	"AGE_RESTRICTED" = 3
}

/** An emoji */
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

/** Overwrites for a channel permission */
export interface ChannelPermissionOverwrite {
	id: string;
	type: 0 | 1;
	allow: string;
	deny: string;
}

/** MetaData for a thread */
export interface ThreadMetaData {
	archived: boolean;
	auto_archive_duration: number;
	archive_timestamp: string;
	locked: boolean;
	invitable?: boolean;
	create_timestamp?: string;
}

/** A member in a thread */
export interface ThreadMember {
	id?: string;
	user_id?: string;
	join_timestamp: string;
	flags: number;
}
/** The client's member in a thread */
export interface ClientThreadMember extends ThreadMember {
	mute_config?: unknown;
	muted?: boolean;
}

/** Different Types of Channels (CONST) */
export const ChannelTypes = {
	0: GuildTextChannel,
	2: GuildVoiceChannel,
	4: GuildCategory,
	5: GuildAnnouncementChannel,
	11: PublicThreadChannel,
	13: GuildStageChannel,
	15: GuildForumChannel
};

/** Different Types of Channels (TYPE) */
export type ChannelTypesType = {
	0: GuildTextChannel;
	2: GuildVoiceChannel;
	4: GuildCategory;
	5: GuildAnnouncementChannel;
	11: PublicThreadChannel;
	13: GuildStageChannel;
	15: GuildForumChannel;
};

/** All channel types */
export type ChannelType = ChannelTypesType[keyof ChannelTypesType] | BaseChannel | GuildChannel;

/** Format for a Gateway Event */
export interface GatewayEventFormat {
	op: number;
	d?: any;
	s?: number;
	t?: any;
}

/** Response Data from a Fetch Request */
export interface FetchResponse {
	data: any;
	status: number;
	res: Response;
}

export interface SessionClientInfo {
	version: number;
	os: string;
	client: string;
}

export enum StickerAnimate {
	"ALWAYS" = 0,
	"HOVER/FOCUS" = 1,
	"NEVER" = 2
}

export enum ExplicitContentFilter {
	"OFF" = 1,
	"FRIENDS EXCLUDED" = 2,
	"EVERYONE" = 3
}

export interface FriendSourceFlags {
	all: boolean;
	mutual_friends: boolean;
	mutual_guilds: boolean;
}

export interface GuildFolder {
	/** Folder Name */
	name: string;
	/** Folder ID */
	id: string;
	/** Guild IDS */
	guild_ids: string[];
}

export type Theme = "dark" | "light";

export type IntegrationType = "twitch" | "youtube" | "discord";

export enum IntegrationExpireBehavior {
	"Remove role" = 0,
	"Kick" = 1
}

export interface IntegrationAccount {
	id: string;
	name: string;
}

export interface IntegrationApplication {
	id: string;
	name: string;
	icon?: string;
	description: string;
	bot?: User;
}

export type OAuth2Scopes = "activities.read" | "activities.write" | "applications.builds.read" | "applications.builds.upload" | "applications.commands" | "applications.commands.update" | "applications.commands.permissions.update" | "applications.entitlements" | "applications.store.update" | "bot" | "connections" | "dm_channels.read" | "email" | "gdm.join" | "guilds" | "guilds.join" | "guilds.members.read" | "identify" | "messages.read" | "relationships.read" | "rpc" | "rpc.activities.write" | "rpc.notifications.read" | "rpc.voice.read" | "rpc.voice.write" | "voice" | "webhook.incoming";

export interface Integration {
	/** Integration ID */
	id: string;
	/** Integration Name */
	name: string;
	/** Integration Type */
	type: IntegrationType;
	/** Is this integration enabled */
	enabled?: boolean;
	/** Is this integration syncing */
	syncing?: boolean;
	/** ID that this integration uses for "subscribers" */
	role_id?: string;
	/** Whether emoticons should be synced for this integration (currently twitch only) */
	enable_emoticons?: boolean;
	/** The behavior of expiring subscribers */
	expire_behavior?: IntegrationExpireBehavior;
	/** The grace period (in days) before expiring subscribers */
	expire_grace_period?: number;
	/** User for this integration */
	user?: User;
	/** Integration account information */
	account: IntegrationAccount;
	/** When this integration was last synced */
	synced_at?: Date;
	/** How many subscribers this integration has */
	subscriber_count?: number;
	/** Has this integration been revoked */
	revoked?: boolean;
	/** The bot/OAuth2 application for discord integrations */
	application?: IntegrationApplication;
	/** The scopes the application has been authorized for */
	scopes?: OAuth2Scopes[];
}

export interface VoiceState {
	guild?: Guild;
	channel_id: string;
	user: User;
	member?: GuildMember;
	session_id: string;
	deaf: boolean;
	mute: boolean;
	self_deaf: boolean;
	self_mute: boolean;
	self_stream?: boolean;
	self_video: boolean;
	suppress: boolean;
	request_to_speak_timestamp: Date;
}

export interface BanObject {
	user: User;
	reason?: string;
}
