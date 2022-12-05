const config = require( '@wordpress/scripts/config/jest-unit.config.js' );

module.exports = {
	...config,
	rootDir: './',
	preset: '@wordpress/jest-preset-default',
	silent: false,
	testMatch: [
		'<rootDir>/tests/jest/*.test.js?(x)',
		'<rootDir>/src/blocks/**/jest/*.test.js?(x)',
		'<rootDir>/src/helper/**/jest/*.test.js?(x)',
	],
	testPathIgnorePatterns: [
		'<rootDir>/.git/',
		'<rootDir>/node_modules/',
		'<rootDir>/vendor/',
	]
};
