import dirFetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import { APIFetchOptions, ChannelTypesEnum, GatewayEventFormat } from "./Types";
import jsdiscordperms from "./Helpers/jsdiscordperms.js";

export { jsdiscordperms, dirFetch, RequestInfo, RequestInit, Response, zlib, erlpack };

export function timeParse(ms: number, hideMs: boolean = false) {
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

export async function fetch(
	url: RequestInfo,
	init?: RequestInit
): Promise<{
	data: any;
	status: number;
	res: Response;
}> {
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

export async function apiFetch(token: string, path: string, options: APIFetchOptions = {}): Promise<any> {
	const requestData: RequestInit = {
		method: options.method || "GET",
		headers: {
			Authorization: token
		}
	};
	const requestURL = `https://discord.com/api/v10${path.startsWith("/") ? path : `/${path}`}${options.queryParams?.length ? `?${options.queryParams.join("&")}` : ""}`;

	let data = await fetch(requestURL, requestData);
	if (data.status == 429 && data.res.headers.get("retry-after")) {
		console.log(`Request To ${requestURL} Hit Rate Limit, Retrying After ${timeParse(parseInt(data.res.headers.get("retry-after")) * 1000)}.`);
		await new Promise(res => setTimeout(res, parseInt(data.res.headers.get("retry-after")) * 1000));
		console.log("Retrying");
		data = await apiFetch(token, path, options);
	}
	return data.data;
}

export function mmh3(key: string, seed?: number) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;

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

export function getChannelListID(channel: ChannelTypesEnum[keyof ChannelTypesEnum]) {
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
	return mmh3(mm3_in);
}

export function genGatewayURL(
	url: string,
	queryParams: { [key: string]: string } = {
		v: "10"
	}
) {
	url = url.split(".gg")[0] + ".gg";
	queryParams.v ??= "10";
	queryParams.encoding ??= "json";
	const params = new URLSearchParams(queryParams).toString();
	return url + "/?" + params;
}
export const textDecoder = new TextDecoder();

let erlpack;
try {
	erlpack = require("erlpack");
} catch {}

let zlib;
try {
	zlib = require("zlib-sync");
} catch {}

let inflate;
if (zlib) {
	inflate = new zlib.Inflate({
		chunkSize: 65535,
		to: "string"
	});
}

export function unpack(data: any, compressed: boolean, useEncryption: boolean): GatewayEventFormat {
	if (data instanceof ArrayBuffer) data = new Uint8Array(data);
	if (compressed) {
		const l = data.length;
		const flush = l >= 4 && data[l - 4] === 0x00 && data[l - 3] === 0x00 && data[l - 2] === 0xff && data[l - 1] === 0xff;
		inflate.push(data, flush && zlib.Z_SYNC_FLUSH);
		data = inflate.result;
	}
	if (useEncryption) {
		if (!Buffer.isBuffer(data)) data = Buffer.from(new Uint8Array(data));
	} else {
		if (typeof data !== "string") {
			data = textDecoder.decode(data);
		}
	}
	return (useEncryption ? erlpack.unpack : JSON.parse)(data);
}
export function pack(data: any, useEncryption: boolean): string | Buffer {
	return (useEncryption ? erlpack.pack : JSON.stringify)(data);
}

export function fillClassValues(
	c: any,
	data: {
		[key: string]: any;
	},
	aliases: {
		[key: string]: string;
	} = {},
	parsers: {
		[key: string]: Function;
	} = {},
	ignore: Array<string> = []
) {
	for (const field of Object.keys(c).filter(i => i != "client" && i != "guild" && !ignore.includes(i))) {
		const parser = parsers[field];
		const info = data[aliases[field] || field];
		if (info === undefined && parser === undefined) continue;
		c[field] = parser ? parser(info) : info;
	}
}
