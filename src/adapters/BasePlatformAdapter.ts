import { PlatformAdapter, PublishContent, PublishResult } from '../types/platform';
import { Notice } from 'obsidian';

export abstract class BasePlatformAdapter implements PlatformAdapter {
	abstract readonly name: string;
	abstract authenticate(): Promise<boolean>;
	abstract publish(content: PublishContent): Promise<PublishResult>;
	abstract update(articleId: string, content: PublishContent): Promise<void>;

	convertMarkdown(markdown: string): string {
		// Basic markdown conversion - override in subclass
		return markdown
			.replace(/^# (.*$)/gim, '<h1>$1</h1>')
			.replace(/^## (.*$)/gim, '<h2>$1</h2>')
			.replace(/^### (.*$)/gim, '<h3>$1</h3>')
			.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
			.replace(/\*(.*)\*/gim, '<em>$1</em>');
	}

	protected showNotice(message: string, timeout: number = 5000): void {
		new Notice(message, timeout);
	}
}
