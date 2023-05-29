# Five In a Row Analyzer

In [**Fira**](https://adamijak.github.io/five-in-a-row-analyzer/) you can play hotseat five in a row or you can challenge bot.

To start playing hit Start button.


## Analysis options

You can get realtime help by selecting analysis method from select menu.
If you select RGB option you will see red and blue colors in fields.
The more the color is solid the more the player of the same color has "higher chance of making a five in a row" by selecting this field (The field is *important* for the player).
If the field is *important* for both players, colors start to blend.

If you select RGB option with Max, the most *important* fields will start to wiggle.

The Score numbers options shows importance score for each player, mostly for debugging purposes.

## Bots

Bots always select one of the overall most *important* fields on board.
Try them out and let them play against each other!

## Log

You can download log of the current game which is stored in txt file.
Each turn is is saved on one line in following format: `{Row} {Col}\n`.

## ETC.

Settings are stored in local storage so you will not lose them.
