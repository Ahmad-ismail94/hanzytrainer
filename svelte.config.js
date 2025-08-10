import adapter from '@sveltejs/adapter-static';
const basePath=process.env.BASE_PATH||'';
export default{kit:{adapter:adapter(),paths:{base:basePath},prerender:{entries:['*']}}};
