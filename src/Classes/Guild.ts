import Client from "../Client";
import GuildMemberManager from "../Managers/GuildMemberManager";
import { GuildScheduledEvent, GuildFeature, Sticker, GuildNSFWLevel, Emoji, VoiceState, AFKTimeout, GuildMFA, GuildBoostLevel, GuildVerificationLevel, GuildExplicitContentFilter, MessageNotificationLevel } from "../Types";
import GuildMember from "./GuildMember";
import ChannelManager from "../Managers/ChannelManager";
import RoleManager from "../Managers/RoleManager";
import { fillClassValues } from "../utils";
import { BanManager } from "../Managers/MiniManagers";
import { Collection } from "@djs-user/collection";

/** A Guild */
class Guild {
	/** Raw Data for the Guild */
	public raw: any;

	/** The Client */
	public client: Client;

	/** The Guild ID */
	public id: string;
	/** The Guild Name */
	public name: string;
	/** The Guild Description */
	public description?: string;
	/** The Guild Icon Hash */
	public icon?: string;
	/** The Guild Banner Hash */
	public banner?: string;
	/** The Member Manager for the Guild */
	public members: GuildMemberManager;
	/** The Guild Owner */
	public owner: GuildMember;
	/** The Voice AFK Timeout (In Seconds) */
	public afk_timeout: AFKTimeout;
	/** The Scheduled Events for the Guild */
	public scheduled_events: Collection<GuildScheduledEvent>;
	/** Flags for the System Channel in the Guild */
	public system_channel_flags: number;
	/** Features for the Guild */
	public features: Collection<GuildFeature>;
	/** The MFA Level for the Guild */
	public mfa: GuildMFA;
	/** Stickers for the Guild */
	public stickers: Collection<Sticker>;
	/** The NSFW Level for the Guild */
	public nsfw_level: GuildNSFWLevel;
	/** Whether the Guild is NSFW */
	public nsfw: boolean;
	/** Whether the Guild is considered Large */
	public large: boolean;
	/** The Preferred Locale of a Community Guild */
	public preferred_locale: string;
	/** The number of boosts the Guild has */
	public boosts: number;
	/** The Guild Boost Tier */
	public boost_tier: GuildBoostLevel;
	/** The Guild Member Count */
	public member_count: number;
	/** When the User joined the Guild */
	public joined_at: Date;
	/** The max number of Users that can be in a Video Channel in the Guild */
	public max_video_channel_users: number;
	/** The Guild Splash Hash */
	public splash?: string;
	/** The Emojis for the Guild */
	public emojis: Collection<Emoji>;
	public application_command_counts: { [key: string]: number };
	/** The Verification Level Required For The Guild */
	public verification_level: GuildVerificationLevel;
	/** The Discovery Splash Hash */
	public discovery_splash?: string;
	/** The Explicit Content Filter Level */
	public explicit_content_filter: GuildExplicitContentFilter;
	/** The Vanity URL Code (Ex: `https://discord.gg/${guild.vanity_url_code}`) */
	public vanity_url_code?: string;
	/** The Vanity URL */
	public vanity_url?: string;
	/** Whether the Guild should be Lazy Loaded */
	public lazy: boolean;
	/** Whether the Guild shows the Boost Bar */
	public boost_bar_enabled: boolean;
	/** The maximum number of member the Guild can have */
	public max_members: number;
	/** The default message notification level */
	public default_message_notifications: MessageNotificationLevel;
	/** The Channels for the Guild */
	public channels: ChannelManager;
	/** The Roles for the Guild */
	public roles: RoleManager;
	/** Whether the Guild is unavailable due to an outage */
	public unavailable: boolean;
	/** Voice States for the Guild */
	public voice_states: Collection<VoiceState>;
	/** Bans for the Guild */
	public bans: BanManager;
	/** The approximate number of Members in the Guild */
	public approximate_member_count?: number;
	/** The approximate number of Member Presences in the Guild */
	public approximate_presence_count?: number;

	/**
	 * A Guild
	 * @param client The Client
	 * @param data Data to fill
	 */
	constructor(client: Client, data: any) {
		this.client = client;
		this.setup(data);
	}

	private async setup(data: any) {
		const aliases = {
			scheduled_events: "guild_scheduled_events",
			mfa: "mfa_level",
			boosts: "premium_subscription_counts",
			boost_tier: "premium_tier",
			boost_bar_enabled: "premium_progress_bar_enabled"
		};
		const parsers = {
			raw: () => data,
			unavailable: u => !!u,
			roles: i => new RoleManager(this.client, this, i),
			channels: c => new ChannelManager(this.client, this, c),
			members: m => new GuildMemberManager(this.client, this, m),
			owner: () => this.members.cache.find((m: GuildMember) => m.id == data.owner_id),
			vanity_url: () => {
				if (data.vanity_url_code) return `https://discord.gg/${data.vanity_url_code}`;
				else return null;
			},
			features: f => new Collection<GuildFeature>(f),
			joined_at: d => (d ? new Date(d) : null),
			emojis: d =>
				d
					? new Collection<Emoji>(
							d.map(i => {
								i.url = `https://cdn.discordapp.com/emojis/${i.id}.${i.animated ? "gif" : "png"}`;
								return i;
							})
					  )
					: d,
			voice_states: ds =>
				ds
					? new Collection<VoiceState>(
							ds.map(d => {
								if (!d || typeof d != "object") return d;
								if (d.guild_id) d.guild = this;
								if (d.user_id) d.user = this.client.users.find(i => i.id == d.user_id);
								if (d.member) d.member = this.members.cache.find(i => i.id == d.member.user.id);
								if (d.request_to_speak_timestamp) d.request_to_speak_timestamp = new Date(d.request_to_speak_timestamp);
								return d;
							})
					  )
					: ds,
			bans: () => new BanManager(this.client, this),
			stickers: st =>
				st
					? new Collection<Sticker>(
							st.map(s => {
								if (s.user) s.user = this.client.createUser(s.user);
								return s;
							})
					  )
					: st,
			scheduled_events: d =>
				d
					? new Collection<GuildScheduledEvent>(
							d.map(i => {
								i.guild = this;
								i.subscribers = [];
								return i;
							})
					  )
					: d
		};
		fillClassValues(this, data, aliases, parsers);

		if (data.threads) this.channels.pushToCache(data.threads);
		if (data.presences) for (const presence of data.presences) this.members.cache.find(i => i.id == presence.user.id)?._updatePresence(presence);
		this.owner = await this.members.fetchSingle(data.owner_id);
	}

	/**
	 * Fetch and Update the Guild
	 * @returns The Raw Fetch Response (Not Parsed To A Guild Object)
	 */
	public async fetch(): Promise<{ [key: string]: any }> {
		const data = await this.client.apiFetch(`/guilds/${this.id}`, {
			queryParams: ["with_counts=true"]
		});

		await this.setup(data);

		await this.channels.fetch();

		return data;
	}
}

export default Guild;
