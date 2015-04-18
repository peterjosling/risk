package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public abstract class AbstractGame {
	private static final String DEFAULT_MAP = "www/default-map.json";

	protected GameState gameState;
	private int armiesPerPlayer;
	private List<Player> players = new ArrayList<Player>();
	private int currentTurn = -1;

	public AbstractGame(int armiesPerPlayer)
	{
		this.armiesPerPlayer = armiesPerPlayer;
	}

	public void addPlayer(Player player)
	{
		players.add(player);
	}

	public void loadMap(String jsonMap)
	{
		gameState.loadMap(jsonMap);
	}

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

	public void init()
	{
		ArrayList<Integer> playerIds = new ArrayList<Integer>();

		for(Player player: players){
			playerIds.add(player.getId());
		}

		gameState = new GameState(playerIds);
		loadDefaultMap();
	}
	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
	public void assignTerritories()
	{

		for(Player player : this.getPlayers()){
			((AIPlayer)player).getGameState().setDeployableArmies(1);
		}
		gameState.setDeployableArmies(1);
		
		Command command = null;

		int totalTurns = armiesPerPlayer * this.getPlayers().size();
		for(int i = 0; i < totalTurns; i ++){
			Player player = nextTurn();
			if(i < gameState.getMap().getTerritories().size()){
				command = player.getCommand(CommandType.ASSIGN_ARMY);
			} else {
				command = player.getCommand(CommandType.DEPLOY);
			}

			notifyPlayers(command);
		}
		
		for(Player player : this.getPlayers()){
			((AIPlayer)player).getGameState().setDeployableArmies(0);
		}
		gameState.setDeployableArmies(0);
	}
	
	public void calcDeployable()
	{
		for(Player player : players){
			((AIPlayer)player).getGameState().setDeployableArmies();
		}
	}
	
	public void deploy(Player player)
	{
		Command command = player.getCommand(CommandType.DEPLOY);
		if (command.getType() != CommandType.DEPLOY) {
			terminate();
			return;
		}
		notifyPlayers(command);
	}
	
	public void attack(Player player)
	{
		Command attackCommand = player.getCommand(CommandType.ATTACK);
		if (attackCommand.getType() != CommandType.ATTACK) {
			terminate();
			return;
		}
		notifyPlayers(attackCommand);
		
		Territory defTerritory = gameState.getMap().findTerritoryById(((AttackCommand) attackCommand).getDest());
		Player defPlayer = getPlayerById(defTerritory.getOwner());
		Command defCommand = defPlayer.getCommand(CommandType.DEFEND);
		if (defCommand.getType() != CommandType.DEFEND) {
			terminate();
			return;
		}
		notifyPlayers(defCommand);
		
		for(Player playerRoll : players){
			Command rollHash = playerRoll.getCommand(CommandType.ROLL_HASH);
			Command rollNumber = playerRoll.getCommand(CommandType.ROLL_NUMBER);
			
			notifyPlayers(rollHash);
			notifyPlayers(rollNumber);
		}
		
		notifyPlayers(attackCommand);

		if(gameState.getLastAttackSuccessful()){
			Command captureCommand = player.getCommand(CommandType.ATTACK_CAPTURE);
			notifyPlayers(captureCommand);
		}
	}
	
	public void fortify(Player player)
	{
		Command command = player.getCommand(CommandType.FORTIFY);
		if (command.getType() != CommandType.FORTIFY) {
			terminate();
			return;
		}
		notifyPlayers(command);
	}
	
	public void drawCard(Player player)
	{
		Command command = player.getCommand(CommandType.DRAW_CARD);
		if (command.getType() != CommandType.DRAW_CARD) {
			terminate();
			return;
		}
		notifyPlayers(command);
	}

	public void playCards(Player player){
		Command command = player.getCommand(CommandType.PLAY_CARDS);
		if (command.getType() != CommandType.PLAY_CARDS) {
			terminate();
			return;
		}
		notifyPlayers(command);
	}
	public void notifyPlayers(Command command)
	{
		for(Player player: players){
			player.notifyCommand(command);
		}
		gameState.playCommand(command);
	}

	/**
	 * Get the index of the player whose turn it currently is.
	 *
	 * @return Index of the current player, relative to the list of players sorted by ascending ID.
	 */
	public int getCurrentTurn() {
		return currentTurn;
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
		gameState.setAttackSuccessful(false);
		currentTurn++;

		if (currentTurn >= players.size()) {
			currentTurn = 0;
		}

		return getCurrentTurnPlayer();
	}

	public Player getPlayerById(int playerId)
	{
		for(Player player : players){
			if(player.getId() == playerId) return player;
		}
		return null;
	}
	
	public List<Player> getPlayers()
	{
		return players;
	}
	
	public int getArmiesPerPlayer()
	{
		return armiesPerPlayer;
	}
	
	/**
	 * Terminate the current game due to an error/cheating.
	 */
	public void terminate()
	{

	}


}
