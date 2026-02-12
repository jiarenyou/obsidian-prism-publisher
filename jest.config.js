module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	testMatch: ['**/**/*.test.ts'],
	testPathIgnorePatterns: ['/mocks/'],
	moduleFileExtensions: ['ts', 'js', 'jsx', 'tsx', 'json', 'node'],
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.d.ts'
	],
	moduleNameMapper: {
		'^obsidian$': '<rootDir>/tests/mocks/obsidian.ts'
	}
};
