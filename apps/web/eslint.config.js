import { defineConfig } from 'eslint/config';

import { createConfig } from '@sm/config/eslint';

export default defineConfig(createConfig({ react: true, tsconfigRootDir: import.meta.dirname }), {
	// shadcn/ui components export their variants (e.g. buttonVariants) next to the component.
	// Keeping that layout lets the shadcn CLI update them.
	files: ['src/components/ui/**'],
	rules: { 'react-refresh/only-export-components': 'off' },
});
