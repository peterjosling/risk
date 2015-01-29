package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractGame {
	private GameState gameState;
	private int armiesPerPlayer;
	private List players = new ArrayList();

	public AbstractGame(int armiesPerPlayer)
	{
		this.armiesPerPlayer = armiesPerPlayer;
		this.gameState = new GameState();
	}

	public void addPlayer(Player player)
	{
		players.add(player);
	}
}
