import { Collection } from "@djs-user/collection";
import Client from "../../Client";
import { PresenceStatus, TypingState } from "../../Types";
import { wait } from "../../utils";
import User from "../User";
import PresenceActivity from "./PresenceActivity";

/** The Presence for a Guild Member */
export default class UserPresence {
	/** The Client */
	public client: Client;
	/** The User for the Guild Member */
	public user: User;

	/** The User Status */
	public status: PresenceStatus;
	/**
	 * The User Game
	 *
	 * (The activity that should be shown in the Member Status)
	 */
	public game?: PresenceActivity;
	/** Statuses for all the User's platforms */
	public client_statuses: {
		[platform: string]: PresenceStatus;
	};
	/** All activities for the user */
	public activities: Collection<PresenceActivity>;
	/** Is the User/Member Typing */
	public typing: TypingState;

	/**
	 * The Presence for a Guild Member
	 * @param client The Client
	 * @param data Data to set
	 */
	constructor(client: Client, user: User, data: any = {}) {
		this.client = client;
		this.user = user;

		this.typing = {
			typing: false,
			timestamp: 0
		};
		this.status = data.status || "offline";
		this.game = data.game ? new PresenceActivity(this.client, data.game) : null;
		this.client_statuses = data.client_statuses || {};
		this.activities = new Collection<PresenceActivity>(data.activities?.map(i => new PresenceActivity(this.client, i)) || []);
	}

	/**
	 * Update the presence
	 * @param data Data to set
	 * @returns The Updated Presence
	 */
	public update(data: any): this {
		this.status = data.status || "offline";
		this.game = data.game ? new PresenceActivity(this.client, data.game) : null;
		this.client_statuses = data.client_statuses || {};
		this.activities = new Collection<PresenceActivity>(data.activities?.map(i => new PresenceActivity(this.client, i)) || []);
		return this;
	}

	/**
	 * Set the typing state for the Presence
	 * @param state The state
	 * @private
	 */
	public async _setTypingState(
		state: TypingState = {
			typing: false
		}
	) {
		const timestamp = Date.now();
		state.timestamp = timestamp;
		this.typing = state;
		if (!this.typing.typing) return;
		await wait(7500);
		if (this.typing.timestamp == timestamp) {
			this._setTypingState({
				typing: false
			});
		}
	}
}
