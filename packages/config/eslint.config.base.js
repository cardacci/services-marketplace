import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/* Import groups from docs/architecture/code-style.md. Type-only imports stay in their source group. */
const IMPORT_CUSTOM_GROUPS = [
	{ elementNamePattern: '^@sm/', groupName: 'workspace' },
	{ elementNamePattern: '^@/stores/', groupName: 'stores' },
	{ elementNamePattern: '^@/(hooks/|features/[^/]+/api/)', groupName: 'hooks' },
	{
		elementNamePattern: '^@/(components/|features/[^/]+/(components|pages)/)',
		groupName: 'components',
	},
	{ elementNamePattern: '^@/types/', groupName: 'types' },
	{ elementNamePattern: '^@/(lib|constants|assets)/', groupName: 'utils' },
];

const IMPORT_GROUPS = [
	['builtin', 'external'],
	'workspace',
	'stores',
	'hooks',
	'components',
	'types',
	'utils',
	'internal',
	['parent', 'sibling', 'index'],
	'unknown',
];

const SORT_RULES = [
	'sort-classes',
	'sort-enums',
	'sort-exports',
	'sort-interfaces',
	'sort-jsx-props',
	'sort-named-exports',
	'sort-named-imports',
	'sort-object-types',
	'sort-objects',
	'sort-union-types',
];

/**
 * Shared ESLint flat config for every package.
 *
 * @param {object} options
 * @param {boolean} [options.react] Adds the React hooks rules (apps/web).
 * @param {string} options.tsconfigRootDir Folder of the package's tsconfig (`import.meta.dirname`).
 */
export function createConfig({ react = false, tsconfigRootDir }) {
	return defineConfig(
		globalIgnores(['**/coverage/**', '**/dist/**', '**/node_modules/**']),
		eslint.configs.recommended,
		tseslint.configs.strictTypeChecked,
		{
			languageOptions: {
				globals: react ? globals.browser : globals.node,
				parserOptions: {
					projectService: true,
					tsconfigRootDir,
				},
			},
		},
		{
			rules: {
				// NestJS modules are empty classes configured by a decorator (@Module).
				'@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
			},
		},
		{
			plugins: { perfectionist },
			rules: {
				...Object.fromEntries(
					SORT_RULES.map((rule) => [`perfectionist/${rule}`, ['error', { type: 'natural' }]]),
				),
				'perfectionist/sort-imports': [
					'error',
					{
						customGroups: IMPORT_CUSTOM_GROUPS,
						groups: IMPORT_GROUPS,
						internalPattern: ['^@/'],
						type: 'natural',
					},
				],
			},
		},
		react ? reactHooks.configs.flat.recommended : {},
		{
			// Config files (eslint.config.js, prettier.config.js…) are plain JavaScript outside any tsconfig.
			extends: [tseslint.configs.disableTypeChecked],
			files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
		},
		prettier,
	);
}
