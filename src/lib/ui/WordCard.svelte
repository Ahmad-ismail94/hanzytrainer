<script lang="ts">
  import { playWord, replay } from '$lib/core/audio/player';
  import type { VocabCard } from '$lib/core/store/db';
  export let card: VocabCard;
  export let onStartGuided: (id: string) => void;
  export let onStartRecall: (id: string) => void;
  function speakNormal(){playWord(card.simplified,card.audio_ref?{src:card.audio_ref}:undefined,false)}
  function speakSlow(){playWord(card.simplified,card.audio_ref?{src:card.audio_ref}:undefined,true)}
</script>
<div class="card"><div class="hanzi">{card.simplified}</div>
<div class="meta"><span class="pinyin">{card.pinyin}</span>
<button aria-label="Play audio" on:click={speakNormal}>▶︎</button>
<button aria-label="Play slow" on:click={speakSlow}>⟲0.85×</button>
<button aria-label="Replay" on:click={replay}>↺</button></div>
<div class="gloss">{card.english_gloss}</div>
<div class="actions"><button on:click={()=>onStartGuided(card.id)}>Start Guided</button>
<button on:click={()=>onStartRecall(card.id)}>Start Recall</button></div></div>
<style>.card{padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fff}.hanzi{font-size:48px;line-height:1;font-weight:600}.meta{display:flex;align-items:center;gap:8px;margin-top:6px}.pinyin{font-size:16px;color:#374151}.gloss{color:#4b5563;margin-top:4px}.actions{display:flex;gap:8px;margin-top:8px}button{padding:8px 12px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc}button:active{transform:scale(0.98)}</style>