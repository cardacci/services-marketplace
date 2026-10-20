import { createConfig } from '@sm/config/eslint';

// Root-level config files (commitlint, lint-staged, prettier). Each package has its own config.
export default createConfig({ tsconfigRootDir: import.meta.dirname });
