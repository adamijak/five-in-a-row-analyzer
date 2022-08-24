import type { Board } from "$lib/Board";
import { Stone, StoneStrings } from "$lib/Stone";
export class Bot {
    #stone: Stone;

    constructor(stone: Stone) {
        if (stone === Stone.None) {
            throw new Error("Bot can not have empty stone.");
        }

        this.#stone = stone;
    }


    makeMove(board: Board) {
        board.getBestMoves();

        board.putStone(this.#stone, 0, 0);
    }

    get stone() {
        return this.#stone;
    }

    get stoneString() {
        return StoneStrings[this.#stone];
    }
}