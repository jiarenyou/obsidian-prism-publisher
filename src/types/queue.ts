export interface QueueItem {
	notePath: string;
	noteTitle: string;
	platforms: string[];
	priority: number;
	status: 'pending' | 'publishing' | 'completed' | 'failed';
	createdAt: string;
	scheduledAt?: string;
}

export interface PluginSettings {
	accounts: Record<string, AccountInfo>;
	imageCdn: ImageCdnConfig;
	publishQueue: QueueItem[];
}

export interface AccountInfo {
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
	appId?: string;
	openid?: string;
}

export interface ImageCdnConfig {
	provider: string;
	qiniu?: {
		accessKey: string;
		secretKey: string;
		bucket: string;
		domain: string;
	};
}
