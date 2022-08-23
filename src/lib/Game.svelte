<script lang="ts">
    import * as Game from "$lib/Game";
    import { Board } from "$lib/Board";
    export let boardSize = 30;

    let currentPlayer: string;
    let win: boolean;
    let board: Board;
    let scoreVisible = false;
    restart();

    function handleClick(r: number, c: number) {
        if (win || !board.isPlaceEmpty(r, c)) {
            return;
        }
        board.makeMove(currentPlayer, r, c);
        board = board;
        win = board.hasWon(currentPlayer, r, c);
        currentPlayer = Game.swapPlayer(currentPlayer);
    }

    function restart() {
        currentPlayer = Game.Player1;
        board = new Board(boardSize);
        win = false;
    }
</script>

<div style="text-align: center;">
    {#if win}
        <h1>{Game.swapPlayer(currentPlayer)} won!</h1>
    {:else}
        <h1>Current Player: {currentPlayer}</h1>
    {/if}
    <button on:click={restart}>Restart</button>
    <button on:click={() => (scoreVisible = !scoreVisible)}
        >{scoreVisible ? "Hide score" : "Show score"}</button
    >
</div>
<br />
<div
    class="grid-container"
    style="grid-template-columns: repeat({boardSize}, 2rem); grid-template-rows: repeat({boardSize}, 2rem)"
>
    {#each board.board as rowValues, r}
        {#each rowValues as value, c}
            {#if scoreVisible}
                <div
                    style="background-color: rgb(
                    {255 - board.score[r][c].player1 * 10},
                    {255 -
                        board.score[r][c].player1 * 3 -
                        board.score[r][c].player2 * 3},
                    {255 - board.score[r][c].player2 * 10});
                    font-size: 1.5rem"
                    class="grid-item"
                    on:click={() => handleClick(r, c)}
                >
                    {board.score[r][c].scoreIndex > 0 ? "." : value}
                </div>
            {:else}
                <div
                    style="background-color: white; font-size: 1.5rem"
                    class="grid-item"
                    on:click={() => handleClick(r, c)}
                >
                    {value}
                </div>
            {/if}
        {/each}
    {/each}
</div>
<br />
<div
    class="grid-container"
    style="grid-template-columns: repeat({boardSize}, 2rem); grid-template-rows: repeat({boardSize}, 2rem); "
>
    {#each board.score as rowValues, r}
        {#each rowValues as value, c}
            <div class="grid-item">
                <div style="text-align: start;padding-left: 0.4rem;">
                    {value.player1}
                </div>
                <div style="text-align: end; padding-right: 0.4rem;">
                    {value.player2}
                </div>
            </div>
        {/each}
    {/each}
</div>

<style>
    .grid-container {
        display: grid;
        justify-content: center;
    }
    .grid-item {
        border: 1px solid black;
        width: 2rem;
        height: 2rem;
        font-size: 0.8rem;
        text-align: center;
    }
</style>
