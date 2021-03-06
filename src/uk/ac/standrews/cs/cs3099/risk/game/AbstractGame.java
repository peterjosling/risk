package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public abstract class AbstractGame {
	private static final String DEFAULT_MAP = "www/default-map.json";

	protected GameState gameState;
	protected int armiesPerPlayer;
	private List<Player> players = new ArrayList<Player>();
	private int currentTurn = -1;

	/**
	 * Adds a player to the List of players in the game
	 * @param player the player instance to add
	 */
	public void addPlayer(Player player)
	{
		players.add(player);
	}

	/**
	 * Loads a map given as a json string
	 * @param jsonMap - the json representation of a map
	 */
	public void loadMap(String jsonMap)
	{
		gameState.loadMap(jsonMap);
	}

	/**
	 * Loads the default json map for a standard risk game
	 */
	public void loadDefaultMap()
	{
		String json = "";

		try {
			BufferedReader reader = new BufferedReader(new FileReader(DEFAULT_MAP));
			String line;

			while ((line = reader.readLine()) != null) {
				json += line;
			}

			reader.close();
		} catch (FileNotFoundException e) {
			System.err.println("Couldn't find default map JSON file");
			System.exit(1);
		} catch (IOException e) {
			System.err.println("Failed to read from input JSON file");
			System.exit(1);
		}

		loadMap(json);
	}

	/**
	 * Initialises the game state
	 */
	public void init()
	{
		ArrayList<Integer> playerIds = new ArrayList<Integer>();

		for(Player player: players){
			playerIds.add(player.getId());
		}
		armiesPerPlayer = 50-5*players.size();
		gameState = new GameState(playerIds);
		loadDefaultMap();
	}
	
	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
	public abstract void assignTerritories();

	/**
	 * Plays out the deployment phase of the game, getting a command from a player
	 * updating the game state and notifying all players
	 * @param player - the player to get the command from
	 */
	public void deploy(Player player)
	{
		Command command = player.getCommand(CommandType.DEPLOY);
		if (command.getType() != CommandType.DEPLOY) {
			terminate();
			return;
		}
		notifyPlayers(command);
	}

	/**
	 * Plays out the attack phase of the game, getting the appropriate commands from players
	 * updating the game state and notifying all players
	 * @param command - the attack command
	 * @param player - the player who actioned the command
	 */
	public void attack(AttackCommand command, Player player)
	{
		Logger.print("Abstract attack");

		if (command.getType() != CommandType.ATTACK) {
			return;
		}

		notifyPlayers(command);
		
		Territory defTerritory = gameState.getMap().findTerritoryById(((AttackCommand) command).getDest());
		Player defPlayer = getPlayerById(defTerritory.getOwner());
		Command defCommand = defPlayer.getCommand(CommandType.DEFEND);
		if (defCommand.getType() != CommandType.DEFEND) {
			return;
		}
		notifyPlayers(defCommand);

		for(Player playerRoll : players){
			Command rollHash = playerRoll.getCommand(CommandType.ROLL_HASH);
			notifyPlayers(rollHash);
		}
		
		for(Player playerRoll : players){
			Command rollNumber = playerRoll.getCommand(CommandType.ROLL_NUMBER);
			notifyPlayers(rollNumber);
		}

		if(gameState.getLastAttackSuccessful()){
			Command captureCommand = player.getCommand(CommandType.ATTACK_CAPTURE);
			notifyPlayers(captureCommand);
		} else {
			
			Logger.print("Attack Unsuccessful. Remaining Armies: " + gameState.getMap().findTerritoryById(command.getDest()).getArmies());
		}
	}

	/**
	 * Plays out the fortify phase of the game, taking a command
	 * updating the game state and notifying all players
	 * @param command
	 */
	public void fortify(FortifyCommand command){
		if (command.getType() != CommandType.FORTIFY) {
			return;
		}
		gameState.drawCard(command.getPlayerId());
		notifyPlayers(command);
	}

	/**
	 * Plays out the playing cards phase of the game, getting a play cards command from a player
	 * updating the game state and notifying all players
	 * @param player
	 */

	public void playCards(Player player)
	{
		Command command = player.getCommand(CommandType.PLAY_CARDS);
		if (command.getType() != CommandType.PLAY_CARDS) {
			return;
		}
		notifyPlayers(command);
	}

	/**
	 * Sends a notification to all players in the game so that they can update their game state and
	 * plays out the command on the games game state
	 * @param command - the command to notify
	 */
	public void notifyPlayers(Command command)
	{
		for(Player player : players){
			if (player.getId() != command.getPlayerId()) {
				player.notifyCommand(command);
			}
		}
		gameState.playCommand(command);
	}

	/**
	 * Get the index of the player whose turn it currently is.
	 *
	 * @return Index of the current player, relative to the list of players sorted by ascending ID.
	 */
	public int getCurrentTurn() 
	{
		return currentTurn;
	}

	/**
	 * Set the index of the player whose turn it currently is. Should be used after the initial roll is performed.
	 * @param currentTurn
	 */
	public void setCurrentTurn(int currentTurn)
	{
		this.currentTurn = currentTurn;
	}

	/**
	 * @return the {@link Player} instance whose turn it currently is.
	 */
	public Player getCurrentTurnPlayer()
	{
		for (Player player : players) {
			if (player.getId() == currentTurn) {
				return player;
			}
		}

		return null;
	}

	/**
	 * Advance the turn to the next player.
	 * @return The {@link Player} instance whose turn it is after advancing.
	 */
	public Player nextTurn()
	{
		gameState.setAttackSuccessful(false);
		currentTurn++;

		if (currentTurn >= players.size()) {
			currentTurn = 0;
		}

		return getCurrentTurnPlayer();
	}

	/**
	 * Get a player instance given an id of that  player
	 * @param playerId - the player required
	 * @return the player instance or null if no player is found
	 */
	public Player getPlayerById(int playerId)
	{
		for(Player player : players){
			if(player.getId() == playerId) return player;
		}
		return null;
	}

	/**
	 * @return a list of all the players in the game
	 */
	public List<Player> getPlayers()
	{
		return players;
	}

	/**
	 * @return the number of armies each player gets a the start of the game
	 */
	public int getArmiesPerPlayer()
	{
		return armiesPerPlayer;
	}
	
	/**
	 * Terminate the current game due to an error/cheating.
	 */
	public void terminate()
	{
		//TODO work out if we need to do something here or just delete it
	}

}
