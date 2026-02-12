import { Plugin } from 'obsidian';

export default class PrismPublisherPlugin extends Plugin {
	async onload() {
		console.log('Loading Prism Publisher plugin');

		// Add ribbon icon
		this.addRibbonIcon('🌈', 'Prism Publisher', () => {
			console.log('Prism Publisher ribbon icon clicked');
		});

		// Add command
		this.addCommand({
			id: 'publish-to-platforms',
			name: 'Publish to platforms',
			callback: () => {
				console.log('Publish command triggered');
			}
		});
	}

	onunload() {
		console.log('Unloading Prism Publisher plugin');
	}
}
