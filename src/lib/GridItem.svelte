<script lang="ts">
    import type { Score } from "$lib/Score";
    import { Stone } from "$lib/Stone";
    import { ScoreType } from "./ScoreType";

    export let onClick: any;
    export let stone: Stone;
    export let size: number = 100;
    export let isBest: boolean = false;
    export let score: Score;
    export let scoreType: ScoreType = ScoreType.None;

    $: red = 125 + 20 * (score.player2 - score.player1);
    $: green = 0;
    $: blue = 125 + 20 * (score.player1 - score.player2);
    $: alpha = (score.player1 + score.player2) / 20;

    $: grid_item_colored = scoreType !== ScoreType.None;
</script>

<!-- TODO: think about performance, -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
    class="grid-item"
    class:grid-item-best={scoreType === ScoreType.RGBMax && isBest}
    class:grid-item-colored={grid_item_colored}
    xmlns="http://www.w3.org/2000/svg"
    on:click={onClick}
    style:--red={red}
    style:--green={green}
    style:--blue={blue}
    style:--alpha={alpha}
    style:pointer-events={stone === Stone.None ? "auto" : "none"}
    preserveAspectRatio="none"
    viewBox={`0 0 ${size} ${size}`}
>
    {#if scoreType === ScoreType.Numbers && stone !== Stone.O && stone !== Stone.X}
        <text x="10" y="30" class="text">{score.player1}</text>
        <text x="60" y="80" class="text">{score.player2}</text>
    {:else if stone === Stone.O}
        <circle
            r={size / 2 - size / 8}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            stroke-width={size / 10}
            stroke="#0000FF"
        />
    {:else if stone === Stone.X}
        <path
            d="M{size / 8} {size / 8}L{size - size / 8} {size -
                size / 8}M{size - size / 8} {size / 8}L{size / 8} {size -
                size / 8}"
            stroke-width={size / 10}
            stroke="#FF0000"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    {/if}
</svg>

<style>
    .text {
        font-size: xx-large;
    }
    .grid-item {
        border: 1px solid black;
        width: calc(100% - 1px);
        height: calc(100% - 1px);
        transition: background-color 0.4s ease-in-out;
    }

    .grid-item-colored {
        background-color: rgba(
            var(--red),
            var(--green),
            var(--blue),
            var(--alpha)
        );
    }
    .grid-item-best {
        animation: 2.5s infinite colorchange;
        animation-timing-function: ease-in-out;
        --deg: 2deg;
    }

    @keyframes colorchange {
        3%, 9%, 15%{
            transform: rotate(calc(2 * var(--deg)));
        }
        6%, 12%, 18% {
            transform: rotate(calc(-2 * var(--deg)));
        }
        21% {
            transform: rotate(0deg);
        }
    }

    .grid-item:hover {
        box-shadow: 0px 0px 0px 1px grey inset;
        transform: scale(1.1);
        cursor: pointer;
    }
    .grid-item:active {
        transform: scale(1);
    }
</style>
