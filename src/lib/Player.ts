import type { Board } from "$lib/Board";
import { Stone, StoneStrings } from "$lib/Stone";
export class Player {
    #stone: Stone;

    constructor(stone: Stone) {
        if (stone === Stone.None) {
            throw new Error("Player can not have empty stone.");
        }

        this.#stone = stone;
    }


    makeMove(board: Board, r: number, c: number): boolean {
        board.putStone(this.#stone, r, c);

        return board.hasWon(this.#stone, r, c);
    }

    get stone() {
        return this.#stone;
    }

    get stoneString() {
        return StoneStrings[this.#stone];
    }
}