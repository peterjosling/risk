package uk.ac.standrews.cs.cs3099.risk.game;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

public abstract class AbstractGame {
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

	public void loadMap(String jsonMap) throws MapParseException
	{
		MapParser m = new MapParser(jsonMap);
		gameState.loadMap(m);
	}

	public void createGameState()
	{
		ArrayList<Integer> playerIds = new ArrayList<Integer>();
		for(Player player: players){
			playerIds.add(player.getId());
		}
		gameState = new GameState(playerIds);
	}
	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
	public void assignTerritories()
	{
		int totalArmies = armiesPerPlayer * players.size();

		for (int i = 0; i < totalArmies; i++) {
			Player player = nextTurn();
			Command command = null;

			command = player.getCommand(CommandType.ASSIGN_ARMY);

			if (command.getType() != CommandType.ASSIGN_ARMY) {
				terminate();
				return;
			}
			notifyPlayers(command);
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
		Command command = player.getCommand(CommandType.ATTACK);
		if (command.getType() != CommandType.ATTACK) {
			terminate();
			return;
		}
		notifyPlayers(command);
		
		Territory defTerritory = gameState.getMap().findTerritoryById(((AttackCommand) command).getDest());
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
		
		if(gameState.getLastAttackSuccessful()){
			Command captureCommand = player.getCommand(CommandType.ATTACK_CAPTURE);
			notifyPlayers(captureCommand);
		}
	}
	
	public void fortify(Player player)
	{
		Command command = player.getCommand(CommandType.ATTACK);
		if (command.getType() != CommandType.ATTACK) {
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
	
	/**
	 * Terminate the current game due to an error/cheating.
	 */
	public void terminate()
	{

	}


}
