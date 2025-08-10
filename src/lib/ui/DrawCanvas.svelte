<script lang="ts">
  import { processStroke, type Stroke } from '$lib/core/draw/capture';
  import { compareStroke, FLEX, STRICT, type Tolerance } from '$lib/core/validate/validate';
  export let refStroke: Stroke = []; export let mode:'guided'|'recall'='guided'; export let strictness:'flex'|'strict'='flex'; export let onVerdict:(v:'ok'|'close'|'wrong',score:number)=>void;
  let canvas:HTMLCanvasElement; let ctx:CanvasRenderingContext2D; let drawing=false; let rawPoints:[number,number][]=[];
  function getTol():Tolerance{ return strictness==='strict'?STRICT:FLEX; }
  function resize(){const dpr=window.devicePixelRatio||1;const rect=canvas.getBoundingClientRect();canvas.width=Math.floor(rect.width*dpr);canvas.height=Math.floor(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render();}
  function render(){ if(!ctx)return; ctx.clearRect(0,0,canvas.width,canvas.height);
    if(mode==='guided'&&refStroke&&refStroke.length){ctx.strokeStyle='#c7d2fe';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(refStroke[0][0]*canvas.clientWidth,refStroke[0][1]*canvas.clientHeight);for(let i=1;i<refStroke.length;i++){ctx.lineTo(refStroke[i][0]*canvas.clientWidth,refStroke[i][1]*canvas.clientHeight);}ctx.stroke();}
    if(rawPoints.length>1){ctx.strokeStyle='#0ea5e9';ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(rawPoints[0][0],rawPoints[0][1]);for(let i=1;i<rawPoints.length;i++){ctx.lineTo(rawPoints[i][0],rawPoints[i][1])}ctx.stroke();}}
  function toLocal(e:PointerEvent){const rect=canvas.getBoundingClientRect();return [e.clientX-rect.left,e.clientY-rect.top] as [number,number]}
  function onDown(e:PointerEvent){canvas.setPointerCapture(e.pointerId);drawing=true;rawPoints=[toLocal(e)];render()}
  function onMove(e:PointerEvent){if(!drawing)return;rawPoints.push(toLocal(e));render()}
  function onUp(e:PointerEvent){if(!drawing)return;drawing=false;const processed=processStroke(rawPoints.map(p=>[p[0]/canvas.clientWidth,p[1]/canvas.clientHeight]));const tol=getTol();const cmp=refStroke&&refStroke.length?compareStroke(processed,refStroke,tol):{verdict:'ok',score:1};if(cmp.verdict==='ok')ctx.strokeStyle='#22c55e';else if(cmp.verdict==='close')ctx.strokeStyle='#f59e0b';else ctx.strokeStyle='#ef4444';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(rawPoints[0][0],rawPoints[0][1]);for(let i=1;i<rawPoints.length;i++){ctx.lineTo(rawPoints[i][0],rawPoints[i][1])}ctx.stroke();onVerdict&&onVerdict(cmp.verdict as any,cmp.score);rawPoints=[]}
  function onCancel(e:PointerEvent){onUp(e)}
  $: if(canvas){const ro=new ResizeObserver(resize);ro.observe(canvas);}
</script>
<div class="wrap"><canvas bind:this={canvas} on:pointerdown={onDown} on:pointermove={onMove} on:pointerup={onUp} on:pointercancel={onCancel} on:lostpointercapture={onUp}/></div>
<style>.wrap{width:100%;height:46vh;border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc}canvas{width:100%;height:100%;touch-action:none}</style>