import { defineConfig } from 'astro/config';

// https://astro.build/config
import react from "@astrojs/react";
import { test } from 'vitest';

// https://astro.build/config
export default defineConfig({
    integrations: [react()]
});
