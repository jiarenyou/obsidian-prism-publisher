import { describe, it, expect } from '@jest/globals';
import { FrontmatterManager } from '../../src/managers/FrontmatterManager';

describe('FrontmatterManager', () => {
	it('should parse publish config from frontmatter', () => {
		const content = `---
title: Test Post
publish_config:
  platforms:
    - name: wechat
      enabled: true
      priority: 1
---
# Content here
`;
		const manager = new FrontmatterManager();
		const config = manager.parsePublishConfig(content);

		expect(config.platforms).toBeDefined();
		expect(config.platforms.length).toBe(1);
		expect(config.platforms[0].name).toBe('wechat');
	});

	it('should update publish status in frontmatter', () => {
		const content = `---
title: Test Post
---
# Content here
`;
		const manager = new FrontmatterManager();
		const updated = manager.updatePublishStatus(content, 'wechat', {
			status: 'published',
			articleId: 'wx_123',
			url: 'https://example.com/123'
		});

		expect(updated).toContain('publish_status:');
		expect(updated).toContain('wx_123');
	});
});
