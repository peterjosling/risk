package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.ai.DumbPlayer;

public class LocalGame extends AbstractGame {
	public LocalGame(String jsonMap, int playerCount, int armiesPerPlayer) throws MapParseException
	{
		super(armiesPerPlayer);
		
		addPlayer(new LocalPlayer(0));
		
		for (int i = 1; i < playerCount; i++) {
			Player player = new DumbPlayer(i, "Dumb player " + i);

			addPlayer(player);
		}
		
		// Initialise all player gameStates

		this.loadMap(jsonMap);
	}
}
