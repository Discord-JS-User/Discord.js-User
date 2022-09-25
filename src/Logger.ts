import chalk from "./Native Modules/chalk";

/** Client Logger */
export default class Logger {
	/** Whether the Logger is enabled */
	public readonly enabled: boolean = false;

	/**
	 * Client Logger
	 * @param enabled Whether the Logger is enabled
	 */
	constructor(enabled: boolean = false) {
		this.enabled = enabled;
	}

	/** Send a Log Message */
	public log(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.log(chalk.bgBlue.white(" LOG "), ...args);
	}

	/** Send a Warn Message */
	public warn(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.warn(chalk.bgYellow.black(" WARN "), ...args);
	}

	/** Send an Error Message */
	public error(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.error(chalk.bgRed.white(" ERROR "), ...args);
	}

	/** Send a Debug Message */
	public debug(...args: any[]): void {
		// @ts-ignore
		if (this.enabled) console.debug(chalk.bgGreen.white(" DEBUG "), ...args);
	}
}
