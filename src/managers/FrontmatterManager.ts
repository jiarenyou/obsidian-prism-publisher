import { parseYamlFrontmatter, updateYamlFrontmatter } from '../utils/yaml';
import { PublishConfig, PublishStatus } from '../types/publish';

export class FrontmatterManager {
	parsePublishConfig(content: string): PublishConfig {
		const { frontmatter } = parseYamlFrontmatter(content);
		return frontmatter.publish_config || {
			platforms: [],
			images: {
				cdn: '',
				uploaded: false,
				baseUrl: ''
			}
		};
	}

	parsePublishStatus(content: string): PublishStatus {
		const { frontmatter } = parseYamlFrontmatter(content);
		return frontmatter.publish_status || {};
	}

	updatePublishStatus(
		content: string,
		platform: string,
		status: any
	): string {
		const { frontmatter } = parseYamlFrontmatter(content);
		const currentStatus = frontmatter.publish_status || {};
		const updatedStatus = {
			...currentStatus,
			[platform]: { ...currentStatus[platform], ...status }
		};
		return updateYamlFrontmatter(content, {
			publish_status: updatedStatus
		});
	}

	updatePublishConfig(
		content: string,
		config: Partial<PublishConfig>
	): string {
		const { frontmatter } = parseYamlFrontmatter(content);
		const currentConfig = frontmatter.publish_config || {
			platforms: [],
			images: { cdn: '', uploaded: false, baseUrl: '' }
		};
		const updatedConfig = {
			...currentConfig,
			...config
		};
		return updateYamlFrontmatter(content, {
			publish_config: updatedConfig
		});
	}
}
