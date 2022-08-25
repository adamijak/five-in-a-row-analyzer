import { Stone } from "$lib/Stone";
import { BestScore, Score } from "$lib/Score";
export class Board {

    #size: number;
    #maxRowSize: number
    #board: Stone[][];
    #score: Score[][];
    #bestScores: BestScore[];

    constructor(size: number = 5) {
        this.#size = size;
        this.#maxRowSize = 5
        this.#board = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => Stone.None)
        );
        this.#score = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => new Score)
        );
        this.#bestScores = new Array();
    }

    get board() {
        return this.#board;
    }
    get score() {
        return this.#score;
    }

    get bestScores() {
        return this.#bestScores;
    }

    putStone(stone: Stone, row: number, col: number) {
        this.#board[row][col] = stone;

        this.#starIterate(row, col, (r, c) => {
            let getRowFunctions: ((i: number) => number)[] = [
                (i) => r + i,
                (i) => r,
                (i) => r + i,
                (i) => r + i,
            ];
            let getColFunctions: ((i: number) => number)[] = [
                (i) => c,
                (i) => c + i,
                (i) => c + i,
                (i) => c - i,
            ];

            if (!this.#isValidIndex(r) || !this.#isValidIndex(c)) {
                return;
            }
            let scoreO = 0;
            let scoreX = 0;

            for (let i = 0; i < getRowFunctions.length; i++) {
                scoreO += this.#getScore(Stone.O, getRowFunctions[i], getColFunctions[i]);
                scoreX += this.#getScore(Stone.X, getRowFunctions[i], getColFunctions[i]);
            }

            scoreO < 0 ? -1 : scoreO;
            scoreX < 0 ? -1 : scoreX;

            if (scoreX < 0) {
                scoreX = -1;
            }
            this.#score[r][c].player1 = scoreO;
            this.#score[r][c].player2 = scoreX;
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

    #getScore(stone: Stone, getRow: (index: number) => number, getCol: (index: number) => number): number {
        let score = 0;
        let rOrigin = getRow(0);
        let cOrigin = getCol(0);

        if (!this.#isValidIndex(rOrigin) || !this.#isValidIndex(cOrigin)) {
            return 0;
        }

        let origin = this.#board[rOrigin][cOrigin];

        if (origin === Stone.O || origin === Stone.X) {
            return -1;
        }

        for (let n = -2; n <= 2; n++) {
            let windowScore = 0;
            for (let i = -2; i <= 2; i++) {
                let r = getRow(i + n);
                let c = getCol(i + n);
                if (!this.#isValidIndex(r) || !this.#isValidIndex(c) || (this.#board[r][c] != stone && this.#board[r][c] != Stone.None)) {
                    windowScore = 0;
                    break;
                }

                if (this.#board[r][c] == stone) {
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
            this.#score[score.row][score.col].scoreIndex = 1;
        }
        this.#bestScores = bestScores;
    }

    hasWon(stone: Stone, row: number, col: number): boolean {
        if (this.#hasWon(stone, (i) => row + i, (i) => col) ||
            this.#hasWon(stone, (i) => row, (i) => col + i) ||
            this.#hasWon(stone, (i) => row + i, (i) => col + i) ||
            this.#hasWon(stone, (i) => row + i, (i) => col - i)) {
            return true;
        }
        return false;
    }

    #hasWon(stone: Stone, getRow: (index: number) => number, getCol: (index: number) => number): boolean {
        let countInARow = 0;
        let edge = this.#maxRowSize - 1;
        for (let i = -edge; i <= edge; i++) {
            let r = getRow(i);
            let c = getCol(i);
            if (this.#isValidIndex(r) && this.#isValidIndex(c) && this.#board[r][c] === stone) {
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

    hasStonePlaced(row: number, col: number) {
        return this.#board[row][col] !== Stone.None;
    }

    #isValidIndex(i: number) {
        return 0 <= i && i < this.#size;
    }
}


