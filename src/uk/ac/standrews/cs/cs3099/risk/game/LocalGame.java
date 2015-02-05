package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.ai.DumbPlayer;

public class LocalGame extends AbstractGame {
	public LocalGame(int playerCount, int armiesPerPlayer)
	{
		super(armiesPerPlayer);

		for (int i = 1; i < playerCount; i++) {
			Player player = new DumbPlayer(i, "Dumb player " + i);

			addPlayer(player);
		}
	}
}
