import chalk from "./Native Modules/chalk";

/**
 * Logger
 */
export default class Logger {
	public enabled: boolean = false;

	constructor(enabled: boolean = false) {
		this.enabled = enabled;
	}

	public log(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.log(chalk.bgBlue.white(" LOG "), ...args);
	}

	public warn(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.warn(chalk.bgYellow.black(" WARN "), ...args);
	}

	public error(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.error(chalk.bgRed.white(" ERROR "), ...args);
	}

	public debug(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.debug(chalk.bgGreen.white(" DEBUG "), ...args);
	}
}
