import * as Game from "$lib/Game";
export class Board {

    #size: number;
    #maxRowSize: number
    #board: string[][];
    #score: Score[][];

    constructor(size: number = 5) {
        this.#size = size;
        this.#maxRowSize = 5
        this.#board = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => Game.EmptyPlace)
        );
        this.#score = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => new Score)
        );
    }

    get board() {
        return this.#board;
    }
    get score() {
        return this.#score;
    }

    makeMove(player: string, row: number, col: number) {
        this.#board[row][col] = player;
        for (let n = -2; n <= 2; n++) {
            this.#setScore(Game.Player1, (i) => row + i + n, (i) => col)
            this.#setScore(Game.Player1, (i) => row, (i) => col + i + n)
            this.#setScore(Game.Player1, (i) => row + i + n, (i) => col + i + n)
            this.#setScore(Game.Player1, (i) => row + i + n, (i) => col - i - n)
        }

    }

    #setScore(player: string, getRow: (index: number) => number, getCol: (index: number) => number) {
        let score = 0;
        let rOrigin = getRow(0);
        let cOrigin = getCol(0);

        if (!this.#isValidIndex(rOrigin) || !this.#isValidIndex(cOrigin)) {
            return;
        }

        let origin = this.#board[rOrigin][cOrigin];

        if (origin === Game.Player1 || origin === Game.Player2) {
            this.#score[rOrigin][cOrigin].player1 = -1;
            return;
        }

        for (let n = -2; n <= 2; n++) {
            let windowScore = 0;
            for (let i = -2; i <= 2; i++) {
                let r = getRow(i + n);
                let c = getCol(i + n);
                if (!this.#isValidIndex(r) || !this.#isValidIndex(c) || (this.#board[r][c] != player && this.#board[r][c] != Game.EmptyPlace)) {
                    windowScore = 0;
                    break;
                }

                if (this.#board[r][c] == player) {
                    windowScore++;
                }

            }
            score += windowScore;
        }

        this.#score[rOrigin][cOrigin].player1 = score;
    }



    hasWon(player: string, row: number, col: number): boolean {
        if (this.#hasWon(player, (i) => row + i, (i) => col) ||
            this.#hasWon(player, (i) => row, (i) => col + i) ||
            this.#hasWon(player, (i) => row + i, (i) => col + i) ||
            this.#hasWon(player, (i) => row + i, (i) => col - i)) {
            return true;
        }
        return false;
    }

    #hasWon(player: string, getRow: (index: number) => number, getCol: (index: number) => number): boolean {
        let countInARow = 0;
        let edge = this.#maxRowSize - 1;
        for (let i = -edge; i <= edge; i++) {
            let r = getRow(i);
            let c = getCol(i);
            if (this.#isValidIndex(r) && this.#isValidIndex(c) && this.#board[r][c] === player) {
                countInARow++;
                if (countInARow === this.#maxRowSize) {
                    return true;
                }
            } else {
                countInARow = 0;
            }
        }
        return false;
    }

    isPlaceEmpty(row: number, col: number) {
        return this.#board[row][col] === Game.EmptyPlace;
    }

    #isValidIndex(i: number) {
        return 0 <= i && i < this.#size;
    }
}

class Score {
    player1: number = 0;
    player2: number = 0;
}




