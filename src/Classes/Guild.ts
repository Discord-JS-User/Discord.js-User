import Client from "../Client";
import GuildMemberManager from "../Managers/GuildMemberManager";
import { GuildScheduledEvent, GuildFeature, Sticker, GuildNSFWLevel, Emoji } from "../Types";
import GuildMember from "./GuildMember";
import ChannelManager from "../Managers/ChannelManager";
import RoleManager from "../Managers/RoleManager";
import GuildMemberListManager from "../AppElements/MemberList/GuildMemberListManager";
import { fillClassValues } from "../utils";

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
	public scheduled_events: Array<GuildScheduledEvent>;
	public system_channel_flags: number;
	public features: Array<GuildFeature>;
	public mfa: 0 | 1;
	public stickers: Array<Sticker>;
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
	public emojis: Array<Emoji>;
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

	public memberList: GuildMemberListManager;

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
			roles: i => new RoleManager(this.client, this, i),
			channels: () => new ChannelManager(this.client, this),
			members: () => new GuildMemberManager(this.client, this),
			owner: () => this.members.cache.find((m: GuildMember) => m.id == data.owner_id),
			vanity_url: () => {
				if (data.vanity_url_code) return `https://discord.gg/${data.vanity_url_code}`;
				else return null;
			},
			memberList: () => {
				this.client.memberList.loadGuild(this);
				return this.client.memberList.guilds.find(i => i.id == this.id);
			},
			joined_at: d => new Date(d),
			emojis: d =>
				d.map(i => {
					i.url = `https://cdn.discordapp.com/emojis/${i.id}.${i.animated ? "gif" : "png"}`;
					return i;
				})
		};
		fillClassValues(this, data, aliases, parsers);
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
