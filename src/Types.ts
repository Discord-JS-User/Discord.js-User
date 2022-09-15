import User from "./Classes/User";
import GuildCategory from "./Classes/Channels/GuildCategory";
import GuildTextChannel from "./Classes/Channels/Specific/GuildTextChannel";
import GuildVoiceChannel from "./Classes/Channels/Specific/GuildVoiceChannel";
import GuildAnnouncementChannel from "./Classes/Channels/Specific/GuildAnnouncementChannel";
import GuildStageChannel from "./Classes/Channels/Specific/GuildStageChannel";
import GuildForumChannel from "./Classes/Channels/Specific/GuildForumChannel";
import GuildMember from "./Classes/GuildMember";
import { BodyInit } from "node-fetch";

/** Session Data for the client login */
export interface SessionData {
	client_state?: {
		guild_hashes?: Object;
		highest_last_message_id?: string;
		read_state_version?: number;
		user_guild_settings_version?: number;
		user_settings_version?: number;
	};
	properties: {
		browser: "Discord Desktop" | "Discord Android" | string;
		browser_user_agent?: string;
		client_build_number?: string;
		client_event_source?: unknown;
		client_version?: string;
		browser_version?: string;
		device?: string;
		device_id?: string;
		distro?: string;
		os: "Windows" | "Linux" | "OSX" | "iOS" | "Android" | string;
		os_arch?: string;
		os_version?: string;
		referrer?: string;
		referrer_current?: string;
		referring_domain?: string;
		referring_domain_current?: string;
		release_channel?: string;
		window_manager?: string;
		system_locale?: string;
	};
	presence?: {
		activities: object[];
		afk: boolean;
		since: number;
		status: PresenceStatus;
	};
}

/** Options for the client login */
export interface ClientLoginOptions {}

/** Options for the client constructor */
export interface ClientOptions {
	/**
	 * Enable Debug Logging
	 */
	debug?: boolean;
}

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
	archive_timestamp: number;
	locked: boolean;
	invitable?: boolean;
	create_timestamp?: number;
}

/** A member in a thread */
export interface ThreadMember {
	id?: string;
	user_id?: string;
	join_timestamp: number;
	flags: number;
}

/** Different Types of Channels (TYPE) */
export const ChannelTypes = {
	0: GuildTextChannel,
	2: GuildVoiceChannel,
	4: GuildCategory,
	5: GuildAnnouncementChannel,
	13: GuildStageChannel,
	15: GuildForumChannel
};

/** Different Types of Channels (ENUM) */
export type ChannelTypesEnum = {
	0: GuildTextChannel;
	2: GuildVoiceChannel;
	4: GuildCategory;
	5: GuildAnnouncementChannel;
	13: GuildStageChannel;
	15: GuildForumChannel;
};

/** Options for a GuildMemberSync */
export interface GuildMemberSyncOptions {
	typing?: boolean;
	threads?: boolean;
	activities?: boolean;
}

/** Display Data for a MemberListCategory */
export interface MemberListCategoryDisplayData {
	name: string;
	id: string;
	color: number;
	members: Array<GuildMember>;
}

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

export interface UserSettings {
	/** how many seconds being idle before the user is marked as "AFK"; this handles when push notifications are sent */
	afk_timeout: number;
	allow_accessibility_detection: boolean;
	/**	play animated emoji without hovering over them */
	animate_emoji: boolean;
	/** when stickers animate; 0: always, 1: on hover/focus, 2: never */
	animate_stickers: StickerAnimate;
	/** sync phone contacts with discord (seemingly unused, enabling contact sync does not change it) */
	contact_sync_enabled: boolean;
	/** convert "old fashioned" emoticons to emojis */
	convert_emoticons: boolean;
	/** custom status for the user */
	custom_status: CustomStatus;
	/** allow DMs from guild members by default on guild join */
	default_guilds_restricted: boolean;
	/** whether the client will detect accounts from other services for connections */
	detect_platform_accounts: boolean;
	/** show the option to copy ids in right click menus */
	developer_mode: boolean;
	/** hide the activity tab */
	disable_games_tab: boolean;
	/** enable /tts command and playback */
	enabled_tts_command: boolean;
	/** content filter level; 0: off, 1: friends excluded, 2: scan everyone */
	explicit_content_filter: ExplicitContentFilter;
	/** flags for how people can add the user via contact sync */
	friend_discovery_flags: number;
	/** who can add the user as a friend */
	friend_source_flags: FriendSourceFlags;
	/** play GIFs without hovering over them */
	gif_auto_play: boolean;
	/** guild folders set by the user */
	guild_folders: GuildFolder[];
	/** array of guild ids in order of position on the sidebar */
	guild_positions: string[];
	/** display images and video when uploaded directly */
	inline_attachment_media: boolean;
	/** display images and video when linked */
	inline_embed_media: boolean;
	/** user defined locale */
	locale: string;
	/** use compact mode */
	message_display_compact: boolean;
	/** Whether to integrate calls with the phone app */
	native_phone_integration_enabled: boolean;
	/** display embeds */
	render_embeds: boolean;
	/** display reactions */
	render_reactions: boolean;
	/** array of guild ids where the user has disallowed DMs from guild members */
	restricted_guilds: string[];
	/** show playing status for detected/added games */
	show_current_game: boolean;
	/** current status */
	status: PresenceStatus;
	stream_notifications_enabled: boolean;
	/** client theme */
	theme: Theme;
	/** timezone offset in minutes (arbitrary number, no way to change in client) */
	timezone_offset: number;
	/** allow access to NSFW guilds from iOS devices */
	view_nsfw_guilds: boolean;
}
