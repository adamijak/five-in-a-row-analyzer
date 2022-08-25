import type { Board } from "$lib/Board";
import { Stone, StoneStrings } from "$lib/Stone";
import { BestScore } from "$lib/Score";
export class Bot {
    #stone: Stone;

    constructor(stone: Stone) {
        if (stone === Stone.None) {
            throw new Error("Bot can not have empty stone.");
        }

        this.#stone = stone;
    }


    makeMove(board: Board): boolean {
        let bestScores = board.bestScores;
        let move: BestScore | null;
        if (bestScores.length === 0) {
            if (board.hasStonePlaced(15, 15)) {
                throw new Error("Imposible game state.");
            }
            move = new BestScore(14, 14); //Place first stone 

        } else {
            let index = Math.floor(Math.random() * bestScores.length);
            move = bestScores[index];
        }

        board.putStone(this.#stone, move.row, move.col);
        return board.hasWon(this.#stone, move.row, move.col);
    }

    get stone() {
        return this.#stone;
    }

    get stoneString() {
        return StoneStrings[this.#stone];
    }
}