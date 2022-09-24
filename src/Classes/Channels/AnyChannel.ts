import Client from "../../Client";
import { ChannelPermissionOverwrite, ThreadMetaData, ThreadMember } from "../../Types";
import Guild from "../Guild";
import User from "../User";
import GuildCategory from "./GuildCategory";

class AnyChannel {
	public client: Client;
	public guild: Guild;
	public AnyChannel = true;

	public id: string;
	public name?: string;
	public type: 1 | 2 | 3 | 4 | 5 | 10 | 11 | 12 | 13 | 14 | 15;
	public position?: number;
	public permission_overwrites?: Array<ChannelPermissionOverwrite>;
	public topic?: string;
	public nsfw?: boolean;
	public last_message_id?: string;
	public bitrate?: number;
	public user_limit?: number;
	public rate_limit?: number;
	public recipients?: Array<User>;
	public icon?: string;
	public owner?: User;
	public parent?: GuildCategory;
	public last_pin_timestamp?: number;
	public rtc_region?: string;
	public video_quality?: 1 | 2;
	public message_count?: number;
	public thread_meta?: ThreadMetaData;
	public member?: ThreadMember;
	public default_auto_archive_duration?: number;
	public permissions?: string;
	public flags?: number;
	public total_messages_sent?: number;

	constructor(client: Client, data: any, guild: Guild) {
		this.client = client;
		this.guild = guild;
		this.setup(data);
	}

	private async setup(data: any) {
		this.id = data.id;
		this.name = data.name;
		this.type = data.type;
		this.position = data.position;
		this.permission_overwrites = data.permission_overwrites;
		this.topic = data.topic;
		this.nsfw = !!data.nsfw;
		this.last_message_id = data.last_message_id;
		this.bitrate = data.bitrate;
		this.user_limit = data.user_limit;
		this.rate_limit = data.rate_limit_per_user;
		this.recipients = data.recipients?.map((u: any) => new User(this.client, u));
		this.icon = data.icon;
		this.last_pin_timestamp = data.last_pin_timestamp;
		this.rtc_region = data.rtc_region;
		this.video_quality = data.video_quality_mode;
		this.message_count = data.message_count;
		this.thread_meta = data.thread_metadata;
		this.member = data.member;
		this.default_auto_archive_duration = data.default_auto_archive_duration;
		this.permissions = data.permissions;
		this.flags = data.flags;
		this.total_messages_sent = data.total_messages_sent;
		this.parent = data.parent;
		this.owner = data.owner_id ? new User(this.client, await this.client.apiFetch(`/users/${data.owner_id}`)) : undefined;
	}
}

export default AnyChannel;
