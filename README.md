# Discord.js User

### By: [TBHGodPro](https://github.com/TBHGodPro/)

<br/><br/>

## Getting Started

To get started, run `npm i djs-user` in the console, then setup your main file as so:

> Make sure to replace `TOKEN` with your **USER** Token

```js
const Discord = require("djs-user");

const client = new Discord.Client({
	// Enable built in debug logging
	debug: false,
	// Log heartbeats (ONLY WORKS WITH debug ENABLED)
	logHeartbeats: false
});

client.on("ready", () => {
	// Code Here
});

client.login(
	"TOKEN",
	{
		client_state: {
			guild_hashes: {},
			highest_last_message_id: "0",
			read_state_version: 0,
			user_guild_settings_version: -1,
			user_settings_version: -1
		},
		properties: {
			os: "Windows",
			browser: "Discord Desktop",
			release_channel: "stable",
			system_locale: "en-US"
		},
		presence: {
			activities: [],
			afk: false,
			since: null,
			status: "online"
		}
	},
	{}
);
```

And now you're set!

## Extra Packages

Discord.js User has extra packages you can use, as shown below:

-   `@djs-user/utility` Contains utility features such as the `Collection` class, which is similar to an array but is much more optimized and contains async versions of many methods to improve the developer experience
