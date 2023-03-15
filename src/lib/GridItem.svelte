<script lang="ts">
    import type { Score } from "./Score";
    import { Stone } from "./Stone";

    export let onClick: any;
    export let stone: Stone;
    export let size: number = 32;
    export let isBest: boolean = false;
    export let score: Score;
    export let scoreVisible: boolean = false;
</script>

<!-- TODO: think about performance, -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
    class="grid-item"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    on:click={onClick}
    style="box-shadow: 0px 0px {scoreVisible && isBest
        ? '3px 2px'
        : '0px 0px'} red inset;
    background-color: {scoreVisible
        ? `rgb(${255 - score.player1 * 10},${
              255 - score.player1 * 3 - score.player2 * 3
          },${255 - score.player2 * 10})`
        : 'white'}"
>
    {#if stone === Stone.O}
        <circle
            r={size / 2 - size / 8}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            stroke-width={size / 10}
            stroke="#000000"
            shape-rendering="optimizeSpeed"
        />
    {:else if stone === Stone.X}
        <path
            d="M{size / 8} {size / 8}L{size - size / 8} {size -
                size / 8}M{size - size / 8} {size / 8}L{size / 8} {size -
                size / 8}"
            stroke-width={size / 10}
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
            shape-rendering="optimizeSpeed"
        />
    {/if}
</svg>

<style>
    .grid-item {
        border: 1px solid black;
    }
</style>
