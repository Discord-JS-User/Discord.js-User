import Client from "../../Client";
import { CustomStatus, ExplicitContentFilter, FriendSourceFlags, GuildFolder, PresenceStatus, StickerAnimate, Theme } from "../../Types";

/** Settings for the Client User */
export default class UserSettings {
	/** The Client */
	public client: Client;

	/** The Settings */
	public data: UserSettingsObject;

	/**
	 * Settings for the Client User
	 * @param client The Client
	 * @param data The Settings
	 */
	constructor(client: Client, data: any) {
		this.client = client;

		this.data = data;
	}

	/**
	 * Update the data with partial updates
	 * @param data The data (partial)
	 */
	update(data: Partial<UserSettingsObject>) {
		this.data = {
			...this.data,
			...data
		};
	}

	/**
	 * Fetch and update the data
	 * @returns The updated data
	 */
	public async fetch(): Promise<UserSettingsObject> {
		this.data = await this.client.apiFetch("/users/@me/settings");
		return this.data;
	}

	/**
	 * Push the settings to the API
	 * @returns The return data from the request
	 */
	public async push() {
		return await this.client.apiFetch("/users/@me/settings", {
			method: "PATCH",
			body: JSON.stringify(this.data)
		});
	}
}

export interface UserSettingsObject {
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
