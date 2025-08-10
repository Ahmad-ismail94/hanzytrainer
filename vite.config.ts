import { sveltekit } from '@sveltejs/kit/vite';
export default{plugins:[sveltekit()],build:{outDir:'build'},define:{'import.meta.env.BASE_PATH':JSON.stringify(process.env.BASE_PATH||'')}};
