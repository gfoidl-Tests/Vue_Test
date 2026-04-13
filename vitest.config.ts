import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            include    : [
                "./source/**/__tests__/**/*Tests.ts",
                "./tests/**/*Tests.ts"
            ],
            exclude: [...configDefaults.exclude, 'e2e/**'],
            root   : fileURLToPath(new URL('./', import.meta.url))
        },
    }),
)
