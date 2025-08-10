<script lang="ts">
  import { onMount } from 'svelte';
  import WordCard from '$lib/ui/WordCard.svelte';
  import DrawCanvas from '$lib/ui/DrawCanvas.svelte';
  import type { VocabCard } from '$lib/core/store/db';
  import type { Stroke } from '$lib/core/draw/capture';
  let words: VocabCard[] = []; let current: VocabCard | null = null; let refStroke: Stroke = []; let verdict='';
  async function load(){const base=(import.meta.env.BASE_PATH||''); words=await (await fetch(base+'/data/words-50.json')).json(); current=words[0]; const chars=await (await fetch(base+'/data/strokes/characters.json')).json(); if(chars['我']) refStroke=chars['我'][0];}
  function onStartGuided(id:string){current=words.find(x=>x.id===id) || null;}
  function onStartRecall(id:string){current=words.find(x=>x.id===id) || null;}
  function onVerdict(v:'ok'|'close'|'wrong',score:number){verdict=v+' ('+Math.round(score*100)+'%)'; if(navigator.vibrate) navigator.vibrate(v==='ok'?10:v==='close'?20:40);}
  onMount(load);
</script>
<main><h1>Hanzi Trainer</h1>
{#if current}
<section class="card"><WordCard {onStartGuided} {onStartRecall} card={current}/></section>
<section class="canvas"><DrawCanvas {onVerdict} {refStroke} mode="guided" strictness="flex"/><div class="verdict">Result: {verdict}</div></section>
{/if}
<section class="list"><h2>Words</h2><ul>{#each words as w}<li on:click={()=>{current=w;}}>{w.simplified} <small>({w.pinyin})</small></li>{/each}</ul></section>
</main>
<style>main{padding:16px;max-width:800px;margin:0 auto;}h1{font-size:1.5rem;margin:4px 0 12px}.card{margin-bottom:12px}.canvas{margin:12px 0}.verdict{margin-top:8px;font-weight:600}.list ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.list li{padding:8px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}</style>