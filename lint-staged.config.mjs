/**
 * Runs on staged files before each commit. Code goes through ESLint first (ordering fixes),
 * then Prettier. Globs don't overlap, so no file is processed by two tasks at the same time.
 * Markdown is left alone (.prettierignore).
 */
const config = {
	'*.{cjs,js,mjs,ts,tsx}': ['eslint --fix', 'prettier --write'],
	'*.{css,html,json,yaml,yml}': 'prettier --write',
};

export default config;
