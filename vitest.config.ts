import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/tests/**',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/index.ts',
        'debugging/**',
      ],
      reporter: ['text', 'json', 'html'],
    },
  },
});
