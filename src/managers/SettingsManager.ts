import { Plugin } from 'obsidian';
import { PluginSettings, AccountInfo, QueueItem } from '../types/queue';

const DEFAULT_SETTINGS: PluginSettings = {
	accounts: {},
	imageCdn: {
		provider: ''
	},
	publishQueue: []
};

export class SettingsManager {
	private settings: PluginSettings;

	constructor(private plugin: Plugin) {
		this.settings = { ...DEFAULT_SETTINGS };
	}

	async load(): Promise<void> {
		const data = await this.plugin.loadData();
		this.settings = data || { ...DEFAULT_SETTINGS };
	}

	async save(): Promise<void> {
		await this.plugin.saveData(this.settings);
	}

	getSettings(): PluginSettings {
		return this.settings;
	}

	async updateSettings(updates: Partial<PluginSettings>): Promise<void> {
		this.settings = {
			...this.settings,
			...updates
		};
		await this.save();
	}

	getAccount(platform: string): AccountInfo | undefined {
		return this.settings.accounts[platform];
	}

	async setAccount(platform: string, account: AccountInfo): Promise<void> {
		this.settings.accounts[platform] = account;
		await this.save();
	}

	async removeAccount(platform: string): Promise<void> {
		delete this.settings.accounts[platform];
		await this.save();
	}

	getQueue(): QueueItem[] {
		return this.settings.publishQueue;
	}

	async addToQueue(item: QueueItem): Promise<void> {
		this.settings.publishQueue.push(item);
		await this.save();
	}

	async removeFromQueue(notePath: string): Promise<void> {
		this.settings.publishQueue = this.settings.publishQueue.filter(
			item => item.notePath !== notePath
		);
		await this.save();
	}
}
