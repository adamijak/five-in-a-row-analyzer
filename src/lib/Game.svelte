<script lang="ts">
    import { Board } from "$lib/Board";
    import { Stone, StoneStrings } from "$lib/Stone";
    import { Player } from "$lib/Player";
    import { Bot } from "$lib/Bot";
    import GridItem from "$lib/GridItem.svelte";
    import { onMount } from "svelte";
    import { ScoreType } from "./ScoreType";
    import { Score } from "./Score";

    let boardSize = 32;
    let scoreType: ScoreType = ScoreType.None;
    let playerOHuman = true;
    let playerXHuman = true;

    let currentPlayer: Player | Bot;
    let nextPlayer: Player | Bot;
    let winner: Player | Bot | null = null;
    let board: Board = new Board(boardSize);
    let started: boolean = false;

    let fanfare: HTMLAudioElement | null = null;

    let settingsDialog: HTMLDialogElement | null = null;
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

<dialog bind:this={settingsDialog}>
    <h2>Settings</h2>
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
        <button on:click={handleDownload}>Download log</button>
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-missing-content -->
        <a bind:this={downloadLink} download="log.txt" style="display:none" />
    </div>
    <form method="dialog">
        <button>Close</button>
    </form>
</dialog>

<nav class="menu">
    <button on:click={handleStart}>{started ? "Restart" : "Start"}</button>
    <button on:click={() => settingsDialog?.showModal()}>Settings</button>
    <select bind:value={scoreType}>
        <option value={ScoreType.None}>None</option>
        <option value={ScoreType.RGB}>RGB score</option>
        <option value={ScoreType.Numbers}>Score numbers</option>
    </select>
</nav>

<div class="grid-container" style:--boardSize={boardSize}>
    {#each board.board as rowValues, r}
        {#each rowValues as value, c}
            <GridItem
                stone={value}
                onClick={() => handleClick(r, c)}
                isBest={board.score[r][c].scoreIndex > 0}
                score={board.score[r][c]}
                {scoreType}
            />
        {/each}
    {/each}
</div>

<style>
    .menu {
        display: flex;
        flex-direction: row;
        justify-content: start;
        background-color: lightgrey;
    }

    .menu > * {
        margin: 0.5rem;
    }

    .grid-container {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(var(--boardSize), 3vw);
        grid-template-rows: repeat(var(--boardSize), 3vw);
    }

    @media (width <= 600px) {
        .menu {
            justify-content: space-evenly;
        }

        dialog {
            width: 100vw;
            height: 100vh;
        }
    }
</style>
