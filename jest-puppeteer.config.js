const config = require( '@wordpress/scripts/config/jest-e2e.config' );

module.exports = {
	...config,
	rootDir: './',
	preset: 'jest-puppeteer',
	setupFilesAfterEnv: [
		'<rootDir>/tests/e2e/bootstrap.js',
		'@wordpress/jest-console',
		'@wordpress/jest-puppeteer-axe',
	],
	testMatch: [
		'<rootDir>/tests/e2e/*.test.js?(x)',
		'<rootDir>/src/blocks/**/tests/e2e/*.test.js?(x)',
		'<rootDir>/src/helper/**/tests/e2e/*.test.js?(x)',
	],
	testPathIgnorePatterns: [
		'<rootDir>/.git/',
		'<rootDir>/node_modules/',
		'<rootDir>/vendor/',
	],
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
    product: 'chrome',
  },
};
