<script lang="ts">
    import { Board } from "$lib/Board";
    import { Stone, StoneStrings } from "$lib/Stone";
    import { Player } from "$lib/Player";
    import { Bot } from "$lib/Bot";

    let boardSize = 30;
    let scoreVisible = false;
    let scoreMatrixVisible = false;

    let playerOHuman = true;
    let playerXHuman = true;

    let currentPlayer: Player | Bot;
    let nextPlayer: Player | Bot;
    let winner: Player | Bot | null;
    let board: Board;

    function restart() {
        currentPlayer = playerOHuman ? new Player(Stone.O) : new Bot(Stone.O);
        nextPlayer = playerXHuman ? new Player(Stone.X) : new Bot(Stone.X);
        board = new Board(boardSize);
        winner = null;

        if (currentPlayer instanceof Bot) {
            gameLoop(-1, -1);
        }
    }
    restart();

    function gameLoop(r: number, c: number) {
        do {
            if (currentPlayer.makeMove(board, r, c)) {
                winner = currentPlayer;
            }

            board = board;
            [currentPlayer, nextPlayer] = [nextPlayer, currentPlayer]; // Swap players
        } while (currentPlayer instanceof Bot && winner == null);
    }

    function handleClick(r: number, c: number) {
        if (winner != null || board.hasStonePlaced(r, c)) {
            return;
        }

        gameLoop(r, c);
    }
</script>

<div style="text-align: center;">
    {#if winner != null}
        <div>Player {winner.stoneString} won!</div>
    {:else}
        <div>Current Player: {currentPlayer.stoneString}</div>
    {/if}
    <div>
        Show score:<input type="checkbox" bind:checked={scoreVisible} />
    </div>
    <div>
        Show score matrix:<input
            type="checkbox"
            bind:checked={scoreMatrixVisible}
        />
    </div>
    <div>
        Player O:
        <button
            on:click={() => {
                playerOHuman = !playerOHuman;
            }}>{playerOHuman ? "Human" : "Bot"}</button
        >
    </div>
    <div>
        Player X:
        <button
            on:click={() => {
                playerXHuman = !playerXHuman;
            }}>{playerXHuman ? "Human" : "Bot"}</button
        >
    </div>
    <div>
        <button on:click={restart}>Restart</button>
    </div>
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
