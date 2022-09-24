import Client from "../Client";
import GuildMemberManager from "../Managers/GuildMemberManager";
import { GuildScheduledEvent, GuildFeature, Sticker, GuildNSFWLevel, Emoji, VoiceState } from "../Types";
import GuildMember from "./GuildMember";
import ChannelManager from "../Managers/ChannelManager";
import RoleManager from "../Managers/RoleManager";
import { fillClassValues } from "../utils";
import { BanManager } from "../Managers/MiniManagers";
import { Collection } from "@discord.js-user/utility";

class Guild {
	public client: Client;

	public raw: any;

	public id: string;
	public name: string;
	public description?: string;
	public icon?: string;
	public banner?: string;
	public members: GuildMemberManager;
	public owner: GuildMember;
	public afk_timeout: number;
	public scheduled_events: Collection<GuildScheduledEvent>;
	public system_channel_flags: number;
	public features: Collection<GuildFeature>;
	public mfa: 0 | 1;
	public stickers: Collection<Sticker>;
	public nsfw_level: GuildNSFWLevel;
	public nsfw: boolean;
	public large: boolean;
	public preferred_locale: string;
	public boosts: number;
	public boost_tier: 0 | 1 | 2 | 3;
	public member_count: number;
	public joined_at: Date;
	public max_video_channel_users: number;
	public splash?: string;
	public emojis: Collection<Emoji>;
	public application_command_counts: { [key: string]: number };
	public verification_level: number;
	public discovery_splash?: string;
	public explicit_content_filter: number;
	public vanity_url_code?: string;
	public vanity_url?: string;
	public lazy: boolean;
	public boost_bar_enabled: boolean;
	public max_members: number;
	public default_message_notifications: number;
	public channels: ChannelManager;
	public roles: RoleManager;
	public unavailable: boolean;
	public voice_states: Collection<VoiceState>;
	public bans: BanManager;

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
	}

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
