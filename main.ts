import { Plugin, Notice } from 'obsidian';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { SettingsManager } from './src/managers/SettingsManager';
import { FrontmatterManager } from './src/managers/FrontmatterManager';

export default class PrismPublisherPlugin extends Plugin {
	private settingsManager: SettingsManager;
	private frontmatterManager: FrontmatterManager;

	async onload() {
		console.log('Loading Prism Publisher plugin');

		// Initialize managers
		this.settingsManager = new SettingsManager(this);
		await this.settingsManager.load();

		this.frontmatterManager = new FrontmatterManager();

		// Add ribbon icon
		this.addRibbonIcon('🌈', 'Prism Publisher', () => {
			this.openQueueManager();
		});

		// Add publish command
		this.addCommand({
			id: 'publish-to-platforms',
			name: 'Publish to platforms',
			callback: () => {
				this.publishToPlatforms();
			}
		});

		// Add settings tab
		this.addSettingTab(new PrismPublisherSettingTab(this.app, this));
	}

	openQueueManager() {
		new Notice('Queue manager coming soon!');
	}

	async publishToPlatforms() {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('No active file');
			return;
		}

		new Notice(`Preparing to publish: ${activeFile.basename}`);
		// TODO: Implement full publishing workflow
	}

	onunload() {
		console.log('Unloading Prism Publisher plugin');
	}

	getSettingsManager() {
		return this.settingsManager;
	}
}

class PrismPublisherSettingTab extends PluginSettingTab {
	plugin: PrismPublisherPlugin;

	constructor(app: App, plugin: PrismPublisherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Account Management')
			.setHeading()
			.setDesc('Manage platform accounts');

		new Setting(containerEl)
			.setName('Platforms')
			.setDesc('Configure platform authentication (coming soon)')
			.addButton(button => button
				.setButtonText('Setup Accounts')
				.setDisabled(true));
	}
}
