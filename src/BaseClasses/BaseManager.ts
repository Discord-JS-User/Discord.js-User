import { Collection } from "@djs-user/collection";
import Client from "../Client";

/** A Basic Manager For Anything */
export default class BaseManager<T> {
	/** The Client that the Manager was made from */
	public client: Client;
	/** The current cache of items */
	public cache: Collection<T> = new Collection<T>();

	/**
	 * A Basic Manager For Anything
	 * @param client The Client that the Manager was made from
	 */
	constructor(client: Client) {
		this.client = client;
	}
}
