import dirFetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import { APIFetchOptions, ChannelType, FetchResponse } from "./Types";
import jsdiscordperms from "./Native Modules/jsdiscordperms";

export { jsdiscordperms, dirFetch, RequestInfo, RequestInit, Response };

/**
 * Parses Time to a Human readable format
 * @param {number} ms The time in milliseconds
 * @param {boolean} hideMs Hides the leftover Milliseconds
 * @returns {string} The parsed time
 */
export function timeParse(ms: number, hideMs: boolean = false): string {
	const weeks = Math.floor(ms / 604800000);
	ms = ms - weeks * 604800000;
	const days = Math.floor(ms / 86400000);
	ms = ms - days * 86400000;
	const hours = Math.floor(ms / 3600000);
	ms = ms - hours * 3600000;
	const minutes = Math.floor(ms / 60000);
	ms = ms - minutes * 60000;
	const seconds = Math.floor(ms / 1000);
	ms = ms - seconds * 1000;

	let time = [];
	if (weeks) time.push(`${weeks} Weeks`);
	if (days) time.push(`${days} Days`);
	if (hours) time.push(`${hours} Hours`);
	if (minutes) time.push(`${minutes} Minutes`);
	if (seconds) time.push(`${seconds} Seconds`);
	if (ms && !hideMs) time.push(`${ms} Milliseconds`);

	let timeStore = time;

	let returnData = time.splice(0, time.length - 1).join(", ");
	if (timeStore.length > 2) returnData += ",";
	if (timeStore.length > 1) returnData += ` and ${time[0]}`;
	else returnData = time[0];

	return returnData;
}

/**
 * Send a fetch request (With data paprsing)
 * @param {RequestInfo} url The URL for the Request
 * @param {RequestInit} init The Options for the Request
 * @returns {Promise<FetchResponse>} The Response from the Fetch
 */
export async function fetch(url: RequestInfo, init?: RequestInit): Promise<FetchResponse> {
	const res = await dirFetch(url, init);
	let data: any = await res.text();
	try {
		data = JSON.parse(data);
	} catch {}
	data = { data };
	data.status = res.status;
	data.res = res;
	return data;
}

/**
 * Sends a fetch request to the API as the User
 * @param {string} token The User Token
 * @param {string} path The API Path (`/api/v10/${path}`)
 * @param {APIFetchOptions} options The options for the request
 * @returns {Promise<any>} Response from the API Fetch
 */
export async function apiFetch(token: string, path: string, options: APIFetchOptions = {}): Promise<any> {
	const requestData: RequestInit = {
		method: options.method || "GET",
		headers: {
			Authorization: token,
			"Content-Type": "application/json",
			...(options.headers || {})
		}
	};

	if (options.body) requestData.body = options.body;

	const requestURL = `https://discord.com/api/v10${path.startsWith("/") ? path : `/${path}`}${options.queryParams?.length ? `?${options.queryParams.join("&")}` : ""}`;

	let data = await fetch(requestURL, requestData);
	if (data.status == 429 && data.res.headers.get("retry-after")) {
		console.log(`Request To \"${requestURL}\" Hit Rate Limit, Retrying After ${timeParse(parseInt(data.res.headers.get("retry-after")) * 1000)}.`);
		await wait(parseInt(data.res.headers.get("retry-after")) * 1000);
		console.log("Retrying");
		data = await apiFetch(token, path, options);
	}
	return data.data;
}

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
export function mmh3(key: string, seed?: number): number {
	let k1: number, h1b: number;

	let remainder = key.length & 3; // key.length % 4
	let bytes = key.length - remainder;
	let h1 = seed;
	let c1 = 0xcc9e2d51;
	let c2 = 0x1b873593;
	let i = 0;

	while (i < bytes) {
		k1 = (key.charCodeAt(i) & 0xff) | ((key.charCodeAt(++i) & 0xff) << 8) | ((key.charCodeAt(++i) & 0xff) << 16) | ((key.charCodeAt(++i) & 0xff) << 24);
		++i;

		k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;

		h1 ^= k1;
		h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
		h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
	}

	k1 = 0;

	switch (remainder) {
		case 3:
			k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2:
			k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1:
			k1 ^= key.charCodeAt(i) & 0xff;

			k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
			h1 ^= k1;
	}

	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = ((h1 & 0xffff) * 0x85ebca6b + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((h1 & 0xffff) * 0xc2b2ae35 + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}

/**
 * Get the list ID for a channel
 * @param channel The Channel
 * @returns {number} The List ID For The Channel
 */
export function getChannelListID(channel: ChannelType): string {
	let hash_in: string[] = [];

	channel.permission_overwrites?.forEach(overwrite => {
		const allow = jsdiscordperms.convertPerms(overwrite.allow);
		const deny = jsdiscordperms.convertPerms(overwrite.deny);

		// @ts-ignore
		if (allow.READ_MESSAGES) hash_in.push(`allow:${overwrite.id}`);
		// @ts-ignore
		else if (deny.READ_MESSAGES) hash_in.push(`deny:${overwrite.id}`);
	});

	const mm3_in = hash_in.join(",");
	return mmh3(mm3_in).toString();
}

/**
 * Generate A Gateway URL
 * @param url Gateway URL
 * @param queryParams Params for the connection
 * @returns {string} The URL
 */
export function genGatewayURL(
	url: string,
	queryParams: { [key: string]: string } = {
		v: "10"
	}
): string {
	url = url.split(".gg")[0] + ".gg";
	queryParams.v ??= "10";
	queryParams.encoding ??= "json";
	return url + "/?" + new URLSearchParams(queryParams).toString();
}

/**
 * Fills a Class's Values
 * @param {unknown} c The Class
 * @param data The data to fill
 * @param aliases Aliases `{'Name In Class': 'Name In Data'}`
 * @param parsers Parsers `{'Name In Class': (data) => data}`
 * @param ignore Ignore `['Name In Class', 'Name In Class']`
 */
export function fillClassValues(
	c: unknown,
	data: {
		[key: string]: any;
	},
	aliases: {
		[key: string]: string;
	} = {},
	parsers: {
		[key: string]: (value: any) => any;
	} = {},
	ignore: Array<string> = []
): unknown {
	for (const field of Object.keys(c).filter(i => i != "client" && i != "guild" && !ignore.includes(i))) {
		const parser = parsers[field];
		const info = data[aliases[field] || field];
		if (info === undefined && parser === undefined) continue;
		c[field] = parser ? parser(info) : info;
	}
	return c;
}

/**
 * Wait for a certain amount of time asynchronously
 * @param time The time to wait (defaults to 0 milliseconds)
 * @returns A Promise that resolves after the specified amount of time
 */
export function wait(time: number = 0): Promise<void> {
	if (typeof time == "string") time = parseInt(time);
	if (typeof time != "number" || time == NaN) throw new TypeError(`Time Argument \`${time}\` Is Not A Number`);
	return new Promise(res => setTimeout(res, time));
}
