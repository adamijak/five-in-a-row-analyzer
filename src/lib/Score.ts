export class Score {
    player1: number = 0;
    player2: number = 0;
    scoreIndex: number = 0;
}

export class BestScore {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}


