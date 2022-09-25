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
	/** The Status Name (Automatically Set) */
	name?: string;
	/** The Status Text */
	state: string;
	/** When The Status Should Expire */
	expires_at?: number;
	/** The Status Emoji */
	emoji?: ActivityEmoji;
	/** The Status Type (Automatically Set) */
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
	/** The Method for the request */
	method?: string;
	/** Query Params for the request */
	queryParams?: Array<string>;
	/** Body for the request */
	body?: BodyInit;
}

/**
 * Different Activity Types
 * @readonly
 * @enum {number}
 */
export enum ActivityType {
	/** A Game - Playing (Game Name) */
	GAME = 0,
	/** A Twitch Stream - Streaming (Stream Title) */
	STREAMING = 1,
	/** Listening to Music - Listening to (Song Name) */
	LISTENING = 2,
	/** Watching a Stream or Video - Watching (Media Title) */
	WATCHING = 3,
	/** A Custom Status - (Status Text) */
	CUSTOM = 4,
	/** Competing In a Tournament - Competing in (Tournament Title) */
	COMPETING = 5
}

/** An emoji for an activity */
export interface ActivityEmoji {
	/** The Emoji Name */
	name: string;
	/** The Emoji ID */
	id: string;
	/** Whether the Emoji is Animated */
	animated: boolean;
	/** The Emoji URL */
	url: string;
}

/** Data for a PresenceActivity */
export interface PresenceData {
	/** The Activity Name */
	name: string;
	/** The Activity ID */
	id: string | "custom";
	/** The Activity Type */
	type: ActivityType;
	/** The Activity Stream URL, only with type 1 */
	url?: string;
	/** The time that the activity was added to the user */
	created_at: Date;
	/** The start and end for the activity (normally for games) */
	timestamps?: ActivityTimestamps;
	/** The Application ID */
	application_id?: string;
	/** What the player is currently doing */
	details?: string;
	/** The User's current party status */
	state?: string;
	/** The Emoji used in Custom Status (Only in type 4) */
	emoji?: ActivityEmoji;
	/** Information about the current party for the player */
	party?: ActivityParty;
	/** Images and hover texts for the presence */
	assets?: ActivityAssets;
	/** Secrets for joining and spectating */
	secrets?: ActivitySecrets;
	/** Whether or not the activity is an instanced game session */
	instance?: boolean;
	/** Flags for the activity */
	flags?: number;
	/** Custom buttons shown in the Rich Presence (max 2) */
	buttons?: Array<ActivityButton>;
	session_id?: string;
}

/** Guild Features */
export type GuildFeature = "ANIMATED_BANNER" | "ANIMATED_ICON" | "AUTO_MODERATION" | "BANNER" | "COMMUNITY" | "DISCOVERABLE" | "FEATURABLE" | "INVITE_SPLASH" | "MEMBER_VERIFICATION_GATE_ENABLED" | "MONETIZATION_ENABLED" | "MORE_STICKERS" | "NEWS" | "PARTNERED" | "PREVIEW_ENABLED" | "PRIVATE_THREADS" | "ROLE_ICONS" | "TICKETED_EVENTS_ENABLED" | "VANITY_URL" | "VERIFIED" | "VIP_REGIONS" | "WELCOME_SCREEN_ENABLED";

/**
 * Statuses for Guild Events
 * @readonly
 * @enum {number}
 */
export enum GuildScheduledEventStatus {
	/** Still waiting to start */
	SCHEDULED = 1,
	/** The Event is currently ongoing */
	ACTIVE = 2,
	/** The Event has completed */
	COMPLETED = 3,
	/** The Event has been cancelled */
	CANCELED = 4
}
/**
 * Types of Guild Scheduled Events
 * @readonly
 * @enum {number}
 */
export enum GuildScheduledEventType {
	STAGE_INSTANCE = 1,
	VOICE = 2,
	EXTERNAL = 3
}
/**
 * Privacy Levels for Guild Scheduled Events
 * @readonly
 * @enum {number}
 */
export enum GuildScheduledEventPrivacyLevel {
	GUILD_ONLY = 2
}
/** MetaData for a Guild Scheduled Event */
export interface GuildScheduledEventMetaData {
	/** The location of the Event (1-100 characters) */
	location?: string;
}
/** A Guild Event */
export interface GuildScheduledEvent {
	/** The Event ID */
	id: string;
	/** The Event Guild ID */
	guild_id: string;
	/** The Guild the Event is in */
	guild: Guild;
	/** The Channel the Event is happening in, null for EXTERNAL type */
	channel_id?: string;
	/** The ID of the person whon created the event */
	creator_id?: string;
	/** The User who created the Event */
	creator?: User;
	/** The Event Name (aka Title) (1-100 characters) */
	name: string;
	/** The Event Description (1-1000 characters) */
	description?: string;
	/** The time the event will start as an `ISO8601 Timestamp` */
	scheduled_start_time: string;
	/** The time the event will start as an `ISO8601 Timestamp` (Required for EXTERNAL type) */
	scheduled_end_time: string;
	/** The Privacy Level for the Event */
	privacy_level: GuildScheduledEventPrivacyLevel;
	/** The status of the Event */
	status: GuildScheduledEventStatus;
	/** The type of the Event */
	entity_type: GuildScheduledEventType;
	/**	The id of an entity associated with the Event */
	entity_id: string;
	/** Additional MetaData for the Event */
	entity_metadata: GuildScheduledEventMetaData;
	/** The Number of Users who have subscribed to the Event */
	user_count?: number;
	/** The Cover Image Hash for the Event */
	image?: string;
	/** An Array of the Subscribers for the Event (NOT ALL OF THEM) */
	subscribers: User[];
}

/**
 * Type of stickers
 * @readonly
 * @enum {number}
 */
export enum StickerType {
	/** An Official Sticker in a Pack, part of Nitro or in a removed purchasable pack */
	STANDARD = 1,
	/** A Sticker uploaded to a Guild for the Guild's Members */
	GUILD = 2
}
/**
 * Format Types of Stickers
 * @readonly
 * @enum {number}
 */
export enum StickerFormatType {
	PNG = 1,
	APNG = 2,
	LOTTIE = 3
}
/** A Sticker */
export interface Sticker {
	/** The Sticker ID */
	id: string;
	/** For standard stickers, the ID of the pack it is from */
	pack_id?: string;
	/** The Sticker Name */
	name: string;
	/** The Sticker Description */
	description: string;
	/** Autocomplete/Suggestion tags for the sticker (max 200 characters) */
	tags: string;
	/** **DEPRECATED** previously the sticker asset hash, now an empty string */
	asset?: string;
	/** The Type of Sticker */
	type: number;
	/** The Type of Sticker Format */
	format_type: StickerType;
	/** (GUILD ONLY) Whether the sticker can be used, may be false due to loss of Server Boosts */
	available?: boolean;
	/** The ID of the Guild that owns the Sticker */
	guild_id?: string;
	/** (GUILD ONLY) The User that uploaded the Sticker */
	user?: User;
	/** The standard sticker's sort order within its pack */
	sort_value?: number;
}

/**
 * A NSFW Level for a Guild
 * @readonly
 * @enum {number}
 */
export enum GuildNSFWLevel {
	DEFAULT = 0,
	EXPLICIT = 1,
	SAFE = 2,
	AGE_RESTRICTED = 3
}

/** An Emoji */
export interface Emoji {
	/** Emoji ID */
	id: string;
	/** Emoji Name */
	name: string;
	/** Roles allowed to use the Emoji */
	roles?: Array<string>;
	/** The User that created the Emoji */
	user?: User;
	/** Whether the Emoji must be wrapped in Colons to be used */
	require_colons: boolean;
	/** Whether the Emoji is manager by an integration */
	managed?: boolean;
	/** Whether the Emoji is animated (If animated, `gif` type, else, `png` type) */
	animated?: boolean;
	/** Whether this Emoji can be used, may be false due to loss of Server Boosts */
	available?: boolean;
	/** The URL for this Emoji */
	url: string;
}

/**
 * Types of Channel Permission Overwrites
 * @readonly
 * @enum {number}
 */
export enum ChannelPermissionOverwriteType {
	/** The Overwrite is About a Role */
	ROLE = 0,
	/** The Overwrite is About a Member */
	MEMBER = 1
}
/** Overwrites for a channel permission */
export interface ChannelPermissionOverwrite {
	/** The Overwrite Target ID (Role or User ID) */
	id: string;
	/** Whether the Overwrite is about a Role or about a User */
	type: ChannelPermissionOverwriteType;
	/** Permission Bit Set for Allowed Permissions */
	allow: string;
	/** Permission Bit Set for Disallowed Permissions */
	deny: string;
}

/** MetaData for a thread */
export interface ThreadMetaData {
	/** Whether the Thread is Archived */
	archived: boolean;
	/** How long it takes for a Thread to automatically archive */
	auto_archive_duration: number;
	/** The `ISO8601 Timestamp` of when the Thread was last archived or unarchived */
	archive_timestamp?: string;
	/** Whether the Thread has been locked */
	locked: boolean;
	/** Whether you can invite people to the Thread */
	invitable?: boolean;
	/** The `ISO8601 Timestamp` of when the thead was created */
	create_timestamp?: string;
}

/** A member in a thread */
export interface ThreadMember {
	/** The Thread ID */
	id?: string;
	/** The Member ID */
	user_id?: string;
	/** The `ISO8601 Timestamp` of when the Member joined the Thread */
	join_timestamp: string;
	/** Any user-thread settings, currently only used for notifications */
	flags: number;
}
/** The client's member in a thread */
export interface ClientThreadMember extends ThreadMember {
	/** The config for the mute */
	mute_config?: unknown;
	/** Whether the thread is muted */
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

/**
 * Known Incoming Gateway OpCodes
 * @readonly
 * @enum {number}
 */
export enum IncomingGatewayOpCodes {
	DISPATCH = 0,
	HEARTBEAT_REQUEST = 1,
	RECONNECT = 7,
	INVALID_SESSION = 9,
	HELLO = 10,
	HEARTBEAT_ACK = 11
}
/**
 * Known Outgoing Gateway OpCodes
 * @readonly
 * @enum {number}
 */
export enum OutgoingGatewayOpCodes {
	HEARTBEAT = 1,
	IDENTIFY = 2,
	PRESENCE_UPDATE = 3,
	VOICE_STATE_UPDATE = 4,
	RESUME = 6,
	REQUEST_GUILD_MEMBERS = 8,
	GUILD_SYNC = 12,
	LAZY_REQUEST = 14,
	REQUEST_INTERACTIONS = 24
}
/** Format for a Gateway Event */
export interface GatewayEventFormat {
	/** The Gateway OpCode */
	op: IncomingGatewayOpCodes | OutgoingGatewayOpCodes;
	/** The Message Data */
	d?: any;
	/** The Message Sequence Number */
	s?: number;
	/** (ONLY ON DISPATCH) The Dispatch Event Name */
	t?: any;
}

/** Response Data from a Fetch Request */
export interface FetchResponse {
	/** Data from the request */
	data: any;
	/** The request status */
	status: number;
	/** The Raw Response */
	res: Response;
}

/** Client Info for a Session */
export interface SessionClientInfo {
	/** The Client Version */
	version: number;
	/** The Client OS */
	os: string;
	/** The Client Name */
	client: string;
}

/**
 * When to animate stickers
 * @readonly
 * @enum {number}
 */
export enum StickerAnimate {
	/** Always Animate */
	ALWAYS = 0,
	/** Only Animate On Hover */
	HOVER_FOCUS = 1,
	/** Never Animate */
	NEVER = 2
}

/**
 * Filter for Checking for Explicit Content
 * @readonly
 * @enum {number}
 */
export enum ExplicitContentFilter {
	/** No Filter */
	OFF = 1,
	/** Check Everyone Except Friends */
	FRIENDS_EXCLUDED = 2,
	/** Check Everyone */
	EVERYONE = 3
}

/** Information about who can send you friend request. To set false, either set the value to false or remove the field from the object. */
export interface FriendSourceFlags {
	/** Anyone can send you friend requests */
	all?: boolean;
	/** Friends of friends can send you friend requests */
	mutual_friends?: boolean;
	/** Server Members can send you friend request */
	mutual_guilds?: boolean;
}

/** A Folder for Guilds */
export interface GuildFolder {
	/** Folder Name */
	name: string;
	/** Folder ID */
	id: string;
	/** Guild IDs */
	guild_ids: string[];
}

/** Your Preferred App Theme */
export type Theme = "dark" | "light";

/** Type of Integrations */
export type IntegrationType = "twitch" | "youtube" | "discord";

/**
 * What should happen when a integration expires
 * @readonly
 * @enum {number}
 */
export enum IntegrationExpireBehavior {
	/** Remove the Integration's Role */
	REMOVE_ROLE = 0,
	/** Kick the Integration */
	KICK = 1
}

/** The Account for an Integration */
export interface IntegrationAccount {
	/** The Account ID */
	id: string;
	/** The Account Name */
	name: string;
}

/** The Application for an Integration */
export interface IntegrationApplication {
	/** The Application ID */
	id: string;
	/** The Application Name */
	name: string;
	/** The Application Icon Hash */
	icon?: string;
	/** The Application Description */
	description: string;
	/** The Application Bot User */
	bot?: User;
}

/** OAuth2 Scopes */
export type OAuth2Scopes = "activities.read" | "activities.write" | "applications.builds.read" | "applications.builds.upload" | "applications.commands" | "applications.commands.update" | "applications.commands.permissions.update" | "applications.entitlements" | "applications.store.update" | "bot" | "connections" | "dm_channels.read" | "email" | "gdm.join" | "guilds" | "guilds.join" | "guilds.members.read" | "identify" | "messages.read" | "relationships.read" | "rpc" | "rpc.activities.write" | "rpc.notifications.read" | "rpc.voice.read" | "rpc.voice.write" | "voice" | "webhook.incoming";

/** An Integration */
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

/** A Voice State */
export interface VoiceState {
	/** The Guild (If in a Guild) */
	guild?: Guild;
	/** The Channel ID */
	channel_id: string;
	/** The Voice User */
	user: User;
	/** The GuildMmeber (If in a Guild) */
	member?: GuildMember;
	/** The Voice Session ID */
	session_id: string;
	/** Whether the User is deafened */
	deaf: boolean;
	/** Whether the User is muted */
	mute: boolean;
	/** Whether the User deafened themself (Not server deafened) */
	self_deaf: boolean;
	/** Whether the User muted themself (Not server muted) */
	self_mute: boolean;
	/** Whether the User is streaming */
	self_stream?: boolean;
	/** Whether the User has their camera turned on */
	self_video: boolean;
	/** Whether the User's Permission to Speak is denied */
	suppress: boolean;
	/** The time at which the User requested to speak */
	request_to_speak_timestamp: Date;
}

/** A Ban Object */
export interface BanObject {
	/** The User that was Banned */
	user: User;
	/** The reason for the Ban (If there is one) */
	reason?: string;
}

/** Timestamps for an Activity */
export interface ActivityTimestamps {
	/** The Start Date */
	start?: Date;
	/** The End Date */
	end?: Date;
}

/** Party Information for an Activity */
export interface ActivityParty {
	/** Party ID */
	id?: string;
	/** [Current Size, Max Size] */
	size?: [number, number];
}

/** Assets for the Activity */
export interface ActivityAssets {
	/** The Large Image Hash */
	large_image?: string;
	/** Hover Text for the Large Image */
	large_text?: string;
	/** The Small Image Hash */
	small_image?: string;
	/** Hover Text for the Small Image */
	small_text?: string;
}

/** Secrets for Joining and Spectating Matches */
export interface ActivitySecrets {
	/** Unique hash for chat invites and Ask to Join */
	join?: string;
	/** Unique hash for Spectate button */
	spectate?: string;
	/** Unique hash for the given match context */
	match?: string;
}

/** Buttons for an Activity */
export interface ActivityButton {
	/** The Button Label */
	label?: string;
	/** The Button URL */
	url?: string;
}

/**
 * Levels of Discord Nitro
 * @readonly
 * @enum {number}
 */
export enum DiscordNitroLevel {
	/** No Nitro */
	NONE = 0,
	/** Nitro Classic */
	CLASSIC = 1,
	/** Normal Nitro */
	NITRO = 2
}

/** Tags for a role */
export interface RoleTags {
	/** The ID of the Bot this Role is related to */
	bot_id?: string;
	/** The ID fo the Integration this Role is related to */
	integration_id?: string;
	/** Whether this Role is the Server Boosting Role for the Guild */
	premium_subscriber?: boolean;
}

/** AFK Timeouts for Guild Voice Channels */
export type AFKTimeout = 60 | 300 | 900 | 1800 | 3600;

/**
 * 2FA Level Required to Moderate in a Guild
 * @readonly
 * @enum {number}
 */
export enum GuildMFA {
	/** Guild has no MFA/2FA requirement for moderation actions */
	NONE = 0,
	/** Guild has a 2FA requirement for moderation actions */
	ELEVATED = 1
}

/**
 * Server Boost Level for a Guild
 * @readonly
 * @enum {number}
 */
export enum GuildBoostLevel {
	/** No Level (0 Boosts) */
	NONE = 0,
	/** Tier 1 (2 Boosts) */
	TIER_1 = 1,
	/** Tier 2 (7 Boosts) */
	TIER_2 = 2,
	/** Tier 3 (14 Boosts) */
	TIER_3 = 3
}

/**
 * Verification Level to Be Able to send Messages in a Guild
 * @readonly
 * @enum {number}
 */
export enum GuildVerificationLevel {
	/** Unrestricted */
	NONE = 0,
	/** Must have a verified email */
	LOW = 1,
	/** Must be registered for more than 5 minutes */
	MEDIUM = 2,
	/*** Must be a member of the server for more than 10 minutes */
	HIGH = 3,
	/** Must have a verified phone number */
	VERY_HIGH = 4
}

/**
 * Explicit Media Content Filter for a Guild
 * @readonly
 * @enum {number}
 */
export enum GuildExplicitContentFilter {
	/** Disabled */
	DISABLED = 0,
	/** Scan for Members without Roles */
	MEMBERS_WITHOUT_ROLES = 1,
	/** Scan for All Members */
	ALL_MEMBERS = 2
}

/**
 * Notification Level for Messages
 * @readonly
 * @enum {number}
 */
export enum MessageNotificationLevel {
	/** All Messages */
	ALL_MESSAGES = 0,
	/** Only Messages Where The User Is Mentioned */
	ONLY_MENTIONS = 1
}
