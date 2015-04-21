package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.RollHashCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.RollResultCommand;

import java.util.ArrayList;
import java.util.Random;

public class LocalGame extends AbstractGame {
	int firstplayer = -1;
	Die die;
	private String[] initRollHashes;
	private String[] initRollNumbers;

	/**
	 * Creates a local game with a specific map
	 * @param jsonMap - the risk map in json format
	 * @param playerCount - the number of human players in the game
	 * @param aiCount - the number of AI players in the game
	 * @throws MapParseException
	 */
	public LocalGame(String jsonMap, int playerCount, int aiCount) throws MapParseException
	{
		initialise(playerCount, aiCount);
		this.init();
	}

	/**
	 * Create a local game with the default risk map
	 * @param playerCount -  the number of human players
	 * @param aiCount - the number of AI players
	 */
	public LocalGame(int playerCount, int aiCount)
	{
		initialise(playerCount, aiCount);
		this.init();
	}

	/**
	 * Initialises the game adding the specified number of each player type
	 * @param playerCount - the number of human players
	 * @param aiCount - the number of AI players
	 */
	public void initialise(int playerCount, int aiCount)
	{
		ArrayList<Integer> playerInts = new ArrayList<Integer>();
		
		for (int i = 0; i < playerCount; i++){
			Player player = new LocalPlayer(i);
			playerInts.add(player.getId());
			addPlayer(player);
		}

		for (int i = 0; i < aiCount; i++) {
			Player player = new AIPlayer(playerInts.size());
			playerInts.add(player.getId());
			addPlayer(player);
		}
		
		for(Player player : this.getPlayers()){
			switch (player.getType()) {
			case AI:
				((AIPlayer) player).initialiseGameState(playerInts);
				break;
			case LOCAL:
				((LocalPlayer) player).initialiseGameState(playerInts);
				break;				
			}
		}
	}

	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
	@Override
	public void assignTerritories()	
	{		
		Command command = null;

		int totalTurns = this.getArmiesPerPlayer() * this.getPlayers().size();
		for(int i = 0; i < totalTurns; i ++){
			Player player = nextTurn();
			printMap();
			
			command = player.getCommand(CommandType.ASSIGN_ARMY);

			notifyPlayers(command);
		}
	}
	
	/**
	 * Called when a new dice roll is expected to reinitialise the die state and send the first hash
	 */
	private void startDieRoll()
	{
		die = new Die();

		initRollHashes = new String[this.getPlayers().size()];
		initRollNumbers = new String[this.getPlayers().size()];
		
		for(int i = 0; i < this.getPlayers().size(); i ++){
			byte[] numb = die.generateNumber();
			String num = die.byteToHex(numb);
			String hash = die.byteToHex(die.hashByteArr(numb));
			initRollHashes[i] = hash;
			initRollNumbers[i] = num;		
		}	
		
		for(int i = 0; i < this.getPlayers().size(); i ++){
			try {
				die.addHash(i, initRollHashes[i]);
			} catch (HashMismatchException e) {
				e.printStackTrace();
			}
		}
		
		for(int i = 0; i < this.getPlayers().size(); i ++){
			try {
				die.addNumber(i, initRollNumbers[i]);
			} catch (HashMismatchException e) {
				e.printStackTrace();
			}
		}
		
		try {
			die.finalise();
		} catch (HashMismatchException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Calculates and randomises the deck order.
	 */
	public void calcDeckOrder()
	{
		Random r = new Random();
		int[] deckorder = new int[44];
		for (int i = 0; i < 44; i++) {
			deckorder[i] = (int) ((r.nextInt() & 0xFFFFFFFFL) % 44);
		}
		
		for (Player player : getPlayers()) {
			if (player.getType() == PlayerType.AI)
				((AIPlayer)player).setDeckOrder(deckorder);
			else if (player.getType() == PlayerType.LOCAL)
				((LocalPlayer)player).setDeckOrder(deckorder);
		}

		gameState.setDeckOrder(deckorder);
	}
	
	/**
	 * Initialises the Die and rolls it to select which player will go first.
	 */
	public void calcFirstPlayer()
	{
		startDieRoll();
		firstplayer = (int) (die.nextInt() % getPlayers().size());

		Logger.print("Player " + firstplayer + " will go first, rolling again to shuffle deck");
		setCurrentTurn(firstplayer);
	}

	/**
	 * Runs the game, controlling the game flow, and ending when game is complete
	 */
	public void run()
	{
		int noOfTurns = 0;

		calcFirstPlayer();
		calcDeckOrder();
		
		printMap();
		
		assignTerritories();
		while(!gameState.isGameComplete()){			
			Player currentPlayer = nextTurn();
			if(!gameState.isPlayerDead(currentPlayer.getId())){
				gameState.setDeployableArmies();
//				printMap();
//				System.out.println("Press enter to continue.");
//				String cont = EasyIn.getString();
				System.out.println("It is player " + currentPlayer.getId() + "'s turn.");

				playCards(currentPlayer);
//				System.out.println("Press enter to continue.");
//				String cont = EasyIn.getString();
				
				deploy(currentPlayer);
				
				boolean attackPhase = true;

				while(attackPhase){
					printAttackable(currentPlayer);
					Command command = currentPlayer.getCommand(CommandType.ATTACK);
					if(command.getType() == CommandType.FORTIFY){
						attackPhase = false;
						printFortifyable(currentPlayer);
						fortify((FortifyCommand) command);
					} else {
						attack((AttackCommand) command, getCurrentTurnPlayer());
					}
//					System.out.println("Press enter to continue.");
//					String cont = EasyIn.getString();
				}
				
				checkDeadPlayers();
				noOfTurns++;
			}
		}
		System.out.println("Game complete! Congratulations, player " + getWinner() + " wins!!");
	}

	public void printMap()
	{
		Map map = gameState.getMap();
		System.out.println(map.findTerritoryById(0).getOwner() + ", "
				+ map.findTerritoryById(1).getOwner() + ", "
				+ map.findTerritoryById(2).getOwner() + "    "
				+ map.findTerritoryById(13).getOwner() + ", "
				+ map.findTerritoryById(14).getOwner() + ",    "
				+ map.findTerritoryById(26).getOwner() + ", "
				+ map.findTerritoryById(27).getOwner() + ", "
				+ map.findTerritoryById(28).getOwner() + ", "
				+ map.findTerritoryById(29).getOwner());
		System.out.println(map.findTerritoryById(3).getOwner() + ", "
				+ map.findTerritoryById(4).getOwner() + ", "
				+ map.findTerritoryById(5).getOwner() + ",   "
				+ map.findTerritoryById(16).getOwner() + ", "
				+ map.findTerritoryById(17).getOwner() + ", "
				+ map.findTerritoryById(15).getOwner() + ",       "
				+ map.findTerritoryById(30).getOwner());
		System.out.println(map.findTerritoryById(6).getOwner() + ", "
				+ map.findTerritoryById(7).getOwner() + ",      "
				+ map.findTerritoryById(18).getOwner() + ", "
				+ map.findTerritoryById(19).getOwner() + ",    "
				+ map.findTerritoryById(33).getOwner() + ",    "
				+ map.findTerritoryById(31).getOwner() + ", "
				+ map.findTerritoryById(32).getOwner());
		System.out.println(" " + map.findTerritoryById(8).getOwner() + ",                "
				+ map.findTerritoryById(35).getOwner() + ",  "
				+ map.findTerritoryById(36).getOwner() + ",  "
				+ map.findTerritoryById(34).getOwner());
		System.out.println("            " + 
				+ map.findTerritoryById(20).getOwner() + ", "
				+ map.findTerritoryById(21).getOwner() + "       "
				+ map.findTerritoryById(37).getOwner());
		System.out.println(" " + map.findTerritoryById(9).getOwner() + "           "
				+ map.findTerritoryById(22).getOwner() + ", "
				+ map.findTerritoryById(23).getOwner());
		System.out.println(map.findTerritoryById(8).getOwner() + ", "
				+ map.findTerritoryById(8).getOwner() + "         "
				+ map.findTerritoryById(24).getOwner() + ",  "
				+ map.findTerritoryById(25).getOwner() + ",    "
				+ map.findTerritoryById(38).getOwner() + ", "
				+ map.findTerritoryById(39).getOwner());
		System.out.println(" " + map.findTerritoryById(12).getOwner() + "                     "
				+ map.findTerritoryById(40).getOwner() + ", "
				+ map.findTerritoryById(41).getOwner());
	}
	
	public void printAttackable(Player player){
		printMap();
		Territory[] territories = gameState.getTerritoriesForPlayer(player.getId());
		
		System.out.println("Territory ID | Armies | Attackable Links");
		for(Territory territory : territories){
			String attackable = "[";
			for(Territory linkedTerritory : territory.getLinkedTerritories()){
				if(linkedTerritory.getOwner()!=player.getId()) attackable = attackable + Integer.toString(linkedTerritory.getId()) + ","; 
			}
			attackable += "]";

			System.out.println(territory.getId() + "           |  " + territory.getArmies() + "  | " + attackable);
		}
	}
	
	public void printFortifyable(Player player){
		printMap();
		Territory[] territories = gameState.getTerritoriesForPlayer(player.getId());
		
		System.out.println("Territory ID | Armies | Fortifyable Links");
		for(Territory territory : territories){
			String fortifyable = "[";
			for(Territory linkedTerritory : territory.getLinkedTerritories()){
				if(linkedTerritory.getOwner()==player.getId()) fortifyable = fortifyable + Integer.toString(linkedTerritory.getId()) + ","; 
			}
			fortifyable += "]";

			System.out.println(territory.getId() + "           |  " + territory.getArmies() + "  | " + fortifyable);
		}
	}

	/**
	 * Checks whether a player has been eliminated from the game and if they have add them to the list of dead players
	 */
	public void checkDeadPlayers()
	{
		for(Player player : this.getPlayers()){
			if(gameState.getTerritoriesForPlayer(player.getId()).length == 0){
				for(Player updatePlayer : this.getPlayers()){
					switch (updatePlayer.getType()) {
					case AI:
						((AIPlayer)updatePlayer).getGameState().addDeadPlayer(player.getId());
						break;
					case LOCAL:
						((LocalPlayer)updatePlayer).getGameState().addDeadPlayer(player.getId());
						break;				
					}
				}
				gameState.addDeadPlayer(player.getId());
			}
		}
	}

	/**
	 * Returns the id of the only remaining player in the game or -1 if multiple players remain
	 *  @return the id of the player
	 */
	public int getWinner()
	{
		for(Player player : this.getPlayers()){
			if(!gameState.isPlayerDead(player.getId())) return player.getId();
		}
		return -1;
	}

}
