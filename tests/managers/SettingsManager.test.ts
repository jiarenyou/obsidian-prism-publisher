import { describe, it, expect, beforeEach } from '@jest/globals';
import { SettingsManager } from '../../src/managers/SettingsManager';
import { PluginSettings } from '../../src/types/queue';

describe('SettingsManager', () => {
	it('should load empty settings by default', async () => {
		const plugin = {
			loadData: async () => null
		} as any;

		const manager = new SettingsManager(plugin);
		await manager.load();
		const settings = manager.getSettings();

		expect(settings.accounts).toEqual({});
		expect(settings.publishQueue).toEqual([]);
	});

	it('should save settings', async () => {
		const mockSaveData = jest.fn().mockResolvedValue(undefined);
		const plugin = {
			loadData: async () => null,
			saveData: mockSaveData
		} as any;

		const manager = new SettingsManager(plugin);
		await manager.load();
		await manager.updateSettings({ accounts: { wechat: { accessToken: 'token' } } } as any);

		expect(mockSaveData).toHaveBeenCalled();
	});

	it('should get account info for platform', async () => {
		const settings: PluginSettings = {
			accounts: {
				wechat: {
					accessToken: 'test_token',
					refreshToken: 'refresh',
					expiresAt: '2025-12-31'
				}
			},
			imageCdn: { provider: 'qiniu' },
			publishQueue: []
		};

		const plugin = { loadData: async () => settings } as any;
		const manager = new SettingsManager(plugin);
		await manager.load();

		const account = manager.getAccount('wechat');
		expect(account?.accessToken).toBe('test_token');
	});
});
