<script lang="ts">
    import { Board } from "$lib/Board";
    import { Stone, StoneStrings } from "$lib/Stone";
    import { Player } from "$lib/Player";
    import type { Bot } from "$lib/Bot";

    let boardSize = 30;
    let scoreVisible = false;
    let scoreMatrixVisible = false;

    let currentPlayer: Player | Bot;
    let nextPlayer: Player | Bot;
    let winner: Player | Bot | null;
    let board: Board;

    function restart() {
        currentPlayer = new Player(Stone.O);
        nextPlayer = new Player(Stone.X);
        board = new Board(boardSize);
        winner = null;
    }
    restart();

    function handleClick(r: number, c: number) {
        if (winner != null || board.hasStonePlaced(r, c)) {
            return;
        }

        if (currentPlayer.makeMove(board, r, c)) {
            winner = currentPlayer;
        }

        board = board;
        [currentPlayer, nextPlayer] = [nextPlayer, currentPlayer]; // Swap players
    }
</script>

<div style="text-align: center;">
    {#if winner != null}
        <h1>{winner.stoneString} won!</h1>
    {:else}
        <h1>Current Player: {currentPlayer.stoneString}</h1>
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
                    {board.score[r][c].scoreIndex > 0
                        ? "."
                        : StoneStrings[value]}
                </div>
            {:else}
                <div
                    style="background-color: white; font-size: 1.5rem"
                    class="grid-item"
                    on:click={() => handleClick(r, c)}
                >
                    {StoneStrings[value]}
                </div>
            {/if}
        {/each}
    {/each}
</div>
<br />
{#if scoreMatrixVisible}
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
{/if}

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
