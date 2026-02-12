import { describe, it, expect } from '@jest/globals';
import { BasePlatformAdapter } from '../../src/adapters/BasePlatformAdapter';
import { PublishContent } from '../../src/types/platform';

class TestAdapter extends BasePlatformAdapter {
	readonly name = 'test-platform';

	async authenticate(): Promise<boolean> {
		return true;
	}

	async publish(content: PublishContent) {
		return { success: true };
	}

	async update(articleId: string, content: PublishContent): Promise<void> {
		// Test implementation
	}

	convertMarkdown(markdown: string): string {
		return super.convertMarkdown(markdown);
	}
}

describe('BasePlatformAdapter', () => {
	it('should return platform name', () => {
		const adapter = new TestAdapter();
		expect(adapter.name).toBe('test-platform');
	});

	it('should convert markdown', () => {
		const adapter = new TestAdapter();
		const html = adapter.convertMarkdown('# Test');
		expect(html).toContain('Test');
	});
});
