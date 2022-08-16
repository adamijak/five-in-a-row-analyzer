export let Player1 = "O";
export let Player2 = "X";
export let EmptyPlace = "";

export function swapPlayer(currentPlayer: string) { return currentPlayer === Player1 ? Player2 : Player1; }
