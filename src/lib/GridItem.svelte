<script lang="ts">
    import { Stone } from "./Stone";

    var stone: Stone = Stone.X;
    var size: number = 100;
</script>

<!-- TODO: think about performance, -->
<svg
    class="grid-item"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
>
    {#if stone === Stone.O}
        <ellipse
            rx={size / 2 - size / 10}
            ry={size / 2 - size / 10}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            stroke-width={size / 10}
            stroke="#000000"
        />
    {:else if stone === Stone.X}
        <path
            d="M{size / 10} {size / 10}L{size - size / 10} {size -
                size / 10}M{size - size / 10} {size / 10}L{size / 10} {size -
                size / 10}"
            stroke-width={size / 10}
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    {/if}
</svg>

<style>
    .grid-item {
        border: 1px solid black;
    }
</style>
