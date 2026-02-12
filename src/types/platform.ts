export interface PlatformAdapter {
	readonly name: string;
	authenticate(): Promise<boolean>;
	publish(content: PublishContent): Promise<PublishResult>;
	update(articleId: string, content: PublishContent): Promise<void>;
	convertMarkdown(markdown: string): string;
}

export interface PublishContent {
	title: string;
	markdown: string;
	frontmatter: Record<string, any>;
	images: LocalImage[];
}

export interface PublishResult {
	success: boolean;
	articleId?: string;
	url?: string;
	error?: string;
}

export interface LocalImage {
	path: string;
	caption?: string;
}

export type PlatformName = 'wechat' | 'zhihu' | 'juejin' | 'xiaohongshu' | 'yuque';
