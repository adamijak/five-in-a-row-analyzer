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
        let item = localStorage.getItem("scoreType");
        if (item != null) {
            scoreType = parseInt(item);
        }
        item = localStorage.getItem("playerOHuman");
        if (item != null) {
            playerOHuman = item === "true";
        }
        item = localStorage.getItem("playerXHuman");
        if (item != null) {
            playerXHuman = item === "true";
        }
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
    <form method="dialog">
        <div>
            <div class="form-row">
                <label for="playerOButton">Player O</label>
                <button
                    type="button"
                    id="playerOButton"
                    on:click={() => {
                        playerOHuman = !playerOHuman;
                        localStorage.setItem(
                            "playerOHuman",
                            playerOHuman.toString()
                        );
                    }}
                    >{playerOHuman ? "Human" : "Bot"}
                </button>
            </div>
            <div class="form-row">
                <label for="playerXButton">Player X</label>
                <button
                    type="button"
                    id="playerXButton"
                    on:click={() => {
                        playerXHuman = !playerXHuman;
                        localStorage.setItem(
                            "playerXHuman",
                            playerXHuman.toString()
                        );
                    }}
                    >{playerXHuman ? "Human" : "Bot"}
                </button>
            </div>
        </div>
        <div class="form-row" style="margin-top:2rem">
            <button on:click={handleDownload}>Download log</button>
            <!-- svelte-ignore a11y-missing-content -->
            <a
                bind:this={downloadLink}
                href="/"
                download="log.txt"
                style="display:none"
            />
            <button>Close</button>
        </div>
    </form>
</dialog>

<nav class="menu">
    <button on:click={handleStart}>{started ? "Restart" : "Start"}</button>
    <button on:click={() => settingsDialog?.showModal()}>Settings</button>
    <select
        bind:value={scoreType}
        on:change={() =>
            localStorage.setItem("scoreType", scoreType.toString())}
    >
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
        grid-template-columns: repeat(
            var(--boardSize),
            calc(100% / var(--boardSize))
        );
        grid-template-rows: repeat(
            var(--boardSize),
            calc(100% / var(--boardSize))
        );
    }

    .form-row {
        margin-bottom: 0.75rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    label::after {
        content: ":";
    }

    dialog {
        min-width: 300px;
    }

    dialog::backdrop {
        backdrop-filter: blur(5px) grayscale(1);
        -webkit-backdrop-filter: blur(5px) grayscale(1);
    }

    @media (width <= 600px) {
        .menu {
            justify-content: space-between;
        }

        dialog {
            width: 100vw;
            height: 100vh;
        }
    }
</style>
