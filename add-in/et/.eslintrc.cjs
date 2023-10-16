module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		// 'eslint:recommended',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:react/recommended',
		'plugin:office-addins/react',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	// parser: '@typescript-eslint/parser',
	// parserOptions: {
	// 	ecmaVersion: 'latest',
	// 	sourceType: 'module',
	// },
	plugins: ['office-addins', 'prettier'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'always'],
	},
};
