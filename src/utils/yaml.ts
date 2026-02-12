import * as yaml from 'js-yaml';

export function parseYamlFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
	const match = content.match(/^---\n([\s\S]+?)\n---/);
	if (!match) {
		return { frontmatter: {}, body: content };
	}

	try {
		const frontmatter = yaml.load(match[1]) as Record<string, any>;
		const body = content.slice(match[0].length);
		return { frontmatter, body };
	} catch (error) {
		console.error('Failed to parse YAML frontmatter:', error);
		return { frontmatter: {}, body: content };
	}
}

export function updateYamlFrontmatter(content: string, newFrontmatter: Record<string, any>): string {
	const { frontmatter, body } = parseYamlFrontmatter(content);
	const merged = { ...frontmatter, ...newFrontmatter };
	const yamlStr = yaml.dump(merged);
	return `---\n${yamlStr}---\n${body}`;
}
