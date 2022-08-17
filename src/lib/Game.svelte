<script lang="ts">
    import * as Game from "$lib/Game";
    import { Board } from "$lib/Board";
    export let boardSize = 15;

    let currentPlayer: string;
    let win: boolean;
    let board: Board;
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
</div>
<br />
<div
    class="grid-container"
    style="grid-template-columns: repeat({boardSize}, 50px); grid-template-rows: repeat({boardSize}, 50px)"
>
    {#each board.board as rowValues, r}
        {#each rowValues as value, c}
            <div
                style="background-color: rgb(
                    {255 - board.score[r][c].player1 * 10},
                    {255 -
                    board.score[r][c].player1 * 3 -
                    board.score[r][c].player2 * 3},
                    {255 - board.score[r][c].player2 * 10});
                    font-size: 30px"
                class="grid-item"
                on:click={() => handleClick(r, c)}
            >
                {value}
            </div>
        {/each}
    {/each}
</div>
<br />
<div
    class="grid-container"
    style="grid-template-columns: repeat({boardSize}, 50px); grid-template-rows: repeat({boardSize}, 50px); "
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
        background-color: cmyk();
        border: 1px solid black;
        width: 50px;
        height: 50px;
        font-size: 18px;
        text-align: center;
    }
</style>
