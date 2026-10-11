<script>
  import { onMount } from 'svelte';

  let days = [];
  let state = 'loading';
  let paused = false;
  let visible = false;
  let hidden = false;
  let board;
  const colors = ['#202822', '#244c40', '#377e68', '#60bda0', '#90ead6'];
  const trail = Array.from({ length: 20 }, (_, column) => Array.from({ length: 7 }, (_, step) => `${16 + column * 18},${16 + (column % 2 ? 6 - step : step) * 18}`)).flat();
  const path = `M${trail.join(' L')}`;
  $: total = days.reduce((sum, day) => sum + day.count, 0);
  $: active = days.filter((day) => day.count > 0).length;
  $: stopped = paused || !visible || hidden;

  onMount(() => {
    const controller = new AbortController();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(board);
    const visibility = () => { hidden = document.hidden; };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    fetch('/api/github-activity', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unavailable');
        const data = await response.json();
        days = data.days;
        state = 'ready';
      })
      .catch((error) => { if (error.name !== 'AbortError') state = 'error'; });
    return () => { controller.abort(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  });
</script>

<aside bind:this={board} class:stopped class="activityBoard" aria-label="GitHub contribution activity">
  <div class="boardEyebrow"><span>01 / THE COMMIT TRAIL</span><span class="sourceLabel">GITHUB</span></div>
  <p class="boardTitle">Code, <em>in motion.</em></p>
  <p class="boardIntro">Small steps. Real systems. Every square is a day of building.</p>
  <div class="calendar">
    {#if state === 'ready'}
      <div class="calendarLabels"><span>{days[0].date}</span><span>{days.at(-1).date}</span></div>
      <svg viewBox="0 0 374 140" role="img" aria-label={`${total} GitHub contributions across ${active} active days in the last 20 weeks`}>
        {#each days as day, index}
          <rect x={9 + Math.floor(index / 7) * 18} y={9 + index % 7 * 18} width="14" height="14" rx="2" fill={colors[day.level]}><title>{day.date}: {day.count} contributions</title></rect>
        {/each}
        <g class="snake" aria-hidden="true">
          <path d={path} pathLength="100" fill="none" stroke="#ff8068" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 94" />
          <g class="snakeHead" style={`offset-path:path('${path}')`}>
            <circle r="5" fill="#ff8068" /><circle cx="1.5" cy="-1.8" r="1" fill="#080807" /><circle cx="1.5" cy="1.8" r="1" fill="#080807" />
          </g>
        </g>
      </svg>
      <div class="calendarLegend"><span>LAST 20 WEEKS</span><span>Less {#each colors as color}<i style={`background:${color}`}></i>{/each} More</span></div>
    {:else}
      <p class="calendarStatus" role="status">{state === 'loading' ? 'Connecting to GitHub…' : 'GitHub activity is temporarily unavailable. Explore my work on GitHub below.'}</p>
    {/if}
  </div>
  <div class="boardFooter">
    <p>{#if state === 'ready'}<strong>{total.toLocaleString()}</strong> contributions <span>· {active} active days</span>{:else}<span>@JustXutkarsh</span>{/if}</p>
    {#if state === 'ready'}<button type="button" aria-label={paused ? 'Play contribution snake' : 'Pause contribution snake'} aria-pressed={paused} on:click={() => { paused = !paused; }}>{paused ? 'Play' : 'Pause'}</button>{/if}
  </div>
  <a class="profileLink interactable" href="https://github.com/JustXutkarsh" target="_blank" rel="noopener noreferrer">Explore my GitHub <span aria-hidden="true">↗</span></a>
</aside>

<style>
  .activityBoard{background:#0e120f;border:1px solid #90ead638;box-shadow:8px 8px 0 #90ead60d;padding:clamp(1.25rem,2vw,1.5rem);position:relative;min-width:0;text-align:left;}
  .boardEyebrow,.calendarLabels,.calendarLegend,.boardFooter,.profileLink{font-family:var(--font-mono);}
  .boardEyebrow{display:flex;justify-content:space-between;gap:1rem;color:#90ead6;font-size:.6rem;letter-spacing:.06em;}
  .sourceLabel{color:#ff8068;}
  .boardTitle{color:#f5f1df;font-family:"Rubik",sans-serif;font-size:clamp(1.8rem,2.7vw,2.6rem);letter-spacing:-.05em;line-height:1.2;margin:1.25rem 0 .6rem;}
  .boardTitle em{color:#90ead6;font-family:Georgia,serif;font-weight:400;}
  .boardIntro{color:#a6b0a5;font-size:.75rem;line-height:1.6;margin:0;max-width:30ch;}
  .calendar{margin:1.5rem 0 1rem;min-height:10rem;aspect-ratio:374/178;}
  .calendarLabels,.calendarLegend{display:flex;justify-content:space-between;color:#8b9a8d;font-size:.52rem;}
  svg{display:block;width:100%;height:auto;margin:.75rem 0;overflow:visible;}
  .calendarLegend span:last-child{display:flex;align-items:center;gap:3px;}
  .calendarLegend i{width:7px;height:7px;border-radius:1px;}
  .calendarStatus{color:#a6b0a5;font-family:var(--font-mono);font-size:.75rem;line-height:1.6;height:100%;display:flex;align-items:center;margin:0;}
  .snake path{animation:snakeTrail 26s linear infinite;}
  .snakeHead{animation:snakeHead 26s linear infinite;offset-rotate:auto;}
  .stopped .snake path,.stopped .snakeHead{animation-play-state:paused;}
  .boardFooter{display:flex;align-items:center;justify-content:space-between;gap:.75rem;border-top:1px solid #90ead620;padding-top:1rem;}
  .boardFooter p{color:#c9c7bb;font-size:.6rem;margin:0;line-height:1.7;}
  .boardFooter strong{color:#f5f1df;font-size:1.15rem;font-weight:400;}
  .boardFooter p span{color:#8b9a8d;}
  button{background:transparent;border:1px solid #90ead645;color:#90ead6;font-family:inherit;font-size:.6rem;min-height:44px;padding:.6rem .8rem;cursor:pointer;}
  button:hover,.profileLink:hover{color:#f5f1df;border-color:#90ead6;}
  button:focus-visible,.profileLink:focus-visible{outline:2px solid #ff9bea;outline-offset:4px;}
  .profileLink{color:#90ead6;display:flex;justify-content:space-between;align-items:center;font-size:.65rem;min-height:44px;margin-top:.75rem;}
  @keyframes snakeTrail{from{stroke-dashoffset:6;}to{stroke-dashoffset:-94;}}
  @keyframes snakeHead{from{offset-distance:0%;}to{offset-distance:100%;}}
  @media(prefers-reduced-motion:reduce){.snake{display:none;}button{display:none;}}
</style>
