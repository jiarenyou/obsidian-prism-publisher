export class Plugin {
	async loadData() {
		return null;
	}

	async saveData(data: any) {
		// Mock implementation
	}

	addRibbonIcon() {
		// Mock implementation
	}

	addCommand() {
		// Mock implementation
	}

	addSettingTab() {
		// Mock implementation
	}
}

export class Notice {
	constructor(message: string, timeout?: number) {
		// Mock implementation
	}
}

export function moment() {
	return new Date();
}
