export interface PublishConfig {
	platforms: PlatformConfig[];
	images: ImageConfig;
}

export interface PlatformConfig {
	name: string;
	enabled: boolean;
	priority: number;
}

export interface ImageConfig {
	cdn: string;
	uploaded: boolean;
	baseUrl: string;
}

export interface PublishStatus {
	[platformName: string]: PlatformStatus;
}

export interface PlatformStatus {
	status: 'pending' | 'publishing' | 'published' | 'failed';
	articleId?: string;
	url?: string;
	publishedAt?: string;
	updatedAt?: string;
	error?: string;
	retryCount?: number;
	lastAttempt?: string;
}
