package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

public abstract class AbstractGame {
	private GameState gameState;
	private int armiesPerPlayer;
	private List<Player> players = new ArrayList<Player>();
	private int currentTurn = 0;

	public AbstractGame(int armiesPerPlayer)
	{
		this.armiesPerPlayer = armiesPerPlayer;
		this.gameState = new GameState(new ArrayList<Player>());
	}

	public void addPlayer(Player player)
	{
		players.add(player);
	}

	public void loadMap(String jsonMap) throws MapParseException
	{
		MapParser m = new MapParser(jsonMap);
		gameState.loadMap(m);
	}

	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
	public void assignTerritories()
	{
		int totalArmies = armiesPerPlayer * players.size();

		for (int i = 0; i < totalArmies; i++) {
			Player player = getCurrentTurnPlayer();
			Command move = player.getMove(CommandType.ASSIGN_ARMY);

			if (move.getType() != CommandType.ASSIGN_ARMY) {
				terminate();
				return;
			}

			// gameState.checkMove(move, playerId);
			// gameState.playMove(move, playerId);
		}
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

	/**
	 * Terminate the current game due to an error/cheating.
	 */
	public void terminate()
	{

	}
}
