import Session from "../Classes/ClientUser/Session";
import Client from "../Client";
import { Collection } from "@djs-user/utility";
import BaseManager from "../BaseClasses/BaseManager";

/** A Manager for Client Sessions */
export default class SessionManager extends BaseManager<Session> {
	/**
	 * A Manager for Client Sessions
	 * @param client The Client
	 * @param sessions The Sessions
	 */
	constructor(client: Client, sessions: any) {
		super(client);
		this.cache.push(...sessions.map(i => new Session(this.client, i)));
	}

	/**
	 * Update the Sessions
	 * @param sessions The New Sessions
	 * @returns The updated cache
	 */
	public update(sessions: any[]): Collection<Session> {
		this.cache = new Collection<Session>(sessions.map(i => new Session(this.client, i)));
		return this.cache;
	}
}
