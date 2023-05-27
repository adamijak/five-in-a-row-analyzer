<script lang="ts">
    import { Board } from "$lib/Board";
    import { Stone, StoneStrings } from "$lib/Stone";
    import { Player } from "$lib/Player";
    import { Bot } from "$lib/Bot";
    import GridItem from "$lib/GridItem.svelte";
    import { onMount } from "svelte";

    let gridItemSize = 32;
    let boardSize = 30;
    let scoreVisible = false;

    let playerOHuman = true;
    let playerXHuman = true;

    let currentPlayer: Player | Bot;
    let nextPlayer: Player | Bot;
    let winner: Player | Bot | null = null;
    let board: Board = new Board(boardSize);
    let started: boolean = false;

    let fanfare: HTMLAudioElement | null = null;

    let downloadLink: HTMLAnchorElement | null = null;

    onMount(() => {
        fanfare = new Audio("fanfare.mp3");
    });

    function handleStart() {
        board = new Board(boardSize);
        started = true;
        currentPlayer = playerOHuman ? new Player(Stone.O) : new Bot(Stone.O);
        nextPlayer = playerXHuman ? new Player(Stone.X) : new Bot(Stone.X);
        winner = null;

        if (currentPlayer instanceof Bot) {
            gameLoop(-1, -1);
        }
    }

    function gameLoop(r: number, c: number) {
        do {
            if (currentPlayer.makeMove(board, r, c)) {
                winner = currentPlayer;
                fanfare?.play();
            }

            board = board;
            [currentPlayer, nextPlayer] = [nextPlayer, currentPlayer];
        } while (currentPlayer instanceof Bot && winner == null);
    }

    function handleClick(r: number, c: number) {
        if (!started || winner != null || board.hasStonePlaced(r, c)) {
            return;
        }

        gameLoop(r, c);
    }

    function handleDownload() {
        const data = board.log.toBlob();
        const url = window.URL.createObjectURL(data);
        downloadLink!.href = url;
        downloadLink!.click();
        URL.revokeObjectURL(url);
    }
</script>

<nav class="menu">
    <a href="#settings">Settings</a>
    <a href="#game">Game</a>
    <a href="#score">Score</a>
</nav>

<div id="game" class="tab">
    <div
        class="grid-container"
        style="grid-template-columns: repeat({boardSize}, {gridItemSize + 2}px);
    grid-template-rows: repeat({boardSize}, {gridItemSize + 2}px)"
    >
        {#each board.board as rowValues, r}
            {#each rowValues as value, c}
                <GridItem
                    size={gridItemSize}
                    stone={value}
                    onClick={() => handleClick(r, c)}
                    isBest={board.score[r][c].scoreIndex > 0}
                    score={board.score[r][c]}
                    {scoreVisible}
                />
            {/each}
        {/each}
    </div>
</div>

<div id="score" class="tab">
    <div
        class="grid-container"
        style="grid-template-columns: repeat({boardSize}, {gridItemSize + 2}px);
        grid-template-rows: repeat({boardSize}, {gridItemSize + 2}px)"
    >
        {#each board.score as rowValues, r}
            {#each rowValues as value, c}
                <div class="grid-item">
                    <div style="text-align: start;padding-left: 0.5rem;">
                        {value.player1}
                    </div>
                    <div style="text-align: end; padding-right: 0.5rem;">
                        {value.player2}
                    </div>
                </div>
            {/each}
        {/each}
    </div>
</div>

<div id="settings" class="tab">
    <div style="text-align: center;">
        {#if winner != null}
            <div>Player {winner.stoneString} won!</div>
        {:else if started}
            <div>Current Player: {currentPlayer.stoneString}</div>
        {:else}
            <div>Press start to play.</div>
        {/if}
        <div>
            Show score:<input type="checkbox" bind:checked={scoreVisible} />
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
            <button on:click={handleStart}
                >{started ? "Restart" : "Start"}</button
            >
        </div>
        <div>
            <button on:click={handleDownload}>Download log</button>
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-missing-content -->
            <a
                bind:this={downloadLink}
                download="log.txt"
                style="display:none"
            />
        </div>
    </div>
</div>

<style>
    .menu {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .grid-container {
        display: grid;
        justify-content: center;
    }
    .grid-item {
        border: 2px solid black;
        width: 2rem;
        height: 2rem;
        font-size: 0.8rem;
        text-align: center;
    }

    .tab,
    .tab:target ~ #settings {
        display: none;
    }

    #settings,
    .tab:target {
        display: initial;
    }
</style>
