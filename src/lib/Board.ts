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
        this.#starIterate(row, col, (r, c) => {
            if (!this.#isValidIndex(r) || !this.#isValidIndex(c)) {
                return;
            }
            var score = 0;
            score += this.#getScore(Game.Player1, (i) => r + i, (i) => c);
            score += this.#getScore(Game.Player1, (i) => r, (i) => c + i);
            score += this.#getScore(Game.Player1, (i) => r + i, (i) => c + i);
            score += this.#getScore(Game.Player1, (i) => r + i, (i) => c - i);
            if (score < 0) {
                score = -1;
            }
            this.#score[r][c].player1 = score;
        });
        this.#starIterate(row, col, (r, c) => {
            if (!this.#isValidIndex(r) || !this.#isValidIndex(c)) {
                return;
            }
            var score = 0;
            score += this.#getScore(Game.Player2, (i) => r + i, (i) => c);
            score += this.#getScore(Game.Player2, (i) => r, (i) => c + i);
            score += this.#getScore(Game.Player2, (i) => r + i, (i) => c + i);
            score += this.#getScore(Game.Player2, (i) => r + i, (i) => c - i);
            if (score < 0) {
                score = -1;
            }
            this.#score[r][c].player2 = score;
        });

        this.#setBestScores();

    }

    #starIterate(row: number, col: number, func: (row: number, col: number) => void) {
        for (let i = -4; i <= 4; i++) {
            func(row + i, col);
            func(row, col + i);
            func(row + i, col + i);
            func(row + i, col - i);
        }
    }

    #getScore(player: string, getRow: (index: number) => number, getCol: (index: number) => number): number {
        let score = 0;
        let rOrigin = getRow(0);
        let cOrigin = getCol(0);

        if (!this.#isValidIndex(rOrigin) || !this.#isValidIndex(cOrigin)) {
            return 0;
        }

        let origin = this.#board[rOrigin][cOrigin];

        if (origin === Game.Player1 || origin === Game.Player2) {
            return -1;
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
            score += (windowScore * windowScore);
        }

        return score;
    }

    #setBestScores() {
        let maxScore = -1;
        let bestScores: BestScore[] = new Array<BestScore>();

        for (let r = 0; r < this.#size; r++) {
            for (let c = 0; c < this.#size; c++) {
                let score = this.#score[r][c];
                score.scoreIndex = 0;
                let scoreSum = score.player1 + score.player2;

                if (scoreSum > maxScore) {
                    bestScores = new Array<BestScore>();
                }

                if (scoreSum >= maxScore) {
                    maxScore = scoreSum;
                    bestScores.push(new BestScore(r, c));
                }
            }
        }
        for (let i = 0; i < bestScores.length; i++) {
            let score = bestScores[i];
            this.#score[score.row][score.col].scoreIndex = bestScores.length - i;
        }
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
    scoreIndex: number = 0;
}

class BestScore {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}




