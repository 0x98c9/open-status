// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enables SSR (Dynamic Rendering)
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({
    platformProxy: {
      enabled: true, // Lets you test locally with 'wrangler'
    },
  })
});