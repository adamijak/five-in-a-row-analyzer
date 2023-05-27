<script lang="ts">
    import type { Score } from "$lib/Score";
    import { Stone } from "$lib/Stone";

    export let onClick: any;
    export let stone: Stone;
    export let size: number = 32;
    export let isBest: boolean = false;
    export let score: Score;
    export let scoreVisible: boolean = false;

    $: red = scoreVisible ? 125 + 20 * (score.player1 - score.player2) : 255;
    $: green = scoreVisible ? 0 : 255;
    $: blue = scoreVisible ? 125 + 20 * (score.player2 - score.player1) : 255;
    $: alpha = scoreVisible ? (score.player1 + score.player2) / 20 : 1;

    $: best_grid_item = scoreVisible && isBest;
</script>

<!-- TODO: think about performance, -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
    class="grid-item"
    class:best-grid-item={best_grid_item}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    on:click={onClick}
    style:--red={red}
    style:--green={green}
    style:--blue={blue}
    style:--alpha={alpha}
    style:pointer-events={stone === Stone.None ? "auto" : "none"}
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
        border: 2px solid black;
        background-color: rgba(
            var(--red),
            var(--green),
            var(--blue),
            var(--alpha)
        );
    }

    .grid-item:hover {
        box-shadow: 0px 0px 0px 1px grey inset;
        transform: scale(1.1);
        cursor: pointer;
    }
    .grid-item:active {
        transform: scale(1);
    }
    .best-grid-item {
        background: gold;
    }
</style>
