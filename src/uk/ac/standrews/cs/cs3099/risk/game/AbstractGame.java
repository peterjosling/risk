package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractGame {
	private GameState gameState;
	private int armiesPerPlayer;
	private List<Player> players = new ArrayList<Player>();
	private int currentTurn = 0;

	public AbstractGame(int armiesPerPlayer)
	{
		this.armiesPerPlayer = armiesPerPlayer;
		this.gameState = new GameState();
	}

	public void addPlayer(Player player)
	{
		players.add(player);
	}

	/**
	 * @return the {@link Player} instance whose turn it currently is.
	 */
	public Player getCurrentTurnPlayer()
	{
		return players.get(currentTurn);
	}

	/**
	 * Advance the turn to the next player.
	 * @return The {@link Player} instance whose turn it is after advancing.
	 */
	public Player nextTurn()
	{
		currentTurn++;

		if (currentTurn >= players.size()) {
			currentTurn = 0;
		}

		return getCurrentTurnPlayer();
	}
}
