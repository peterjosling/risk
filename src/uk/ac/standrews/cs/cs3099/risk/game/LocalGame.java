package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;

import java.util.ArrayList;

public class LocalGame extends AbstractGame {

	public LocalGame(String jsonMap, int playerCount, int aiCount) throws MapParseException
	{
		initialise(playerCount, aiCount);
		this.init();
	}
	
	public LocalGame(int playerCount, int aiCount)
	{
		initialise(playerCount, aiCount);
		this.init();
	}
	
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
	
	public void run()
	{
		int noOfTurns = 0;
	
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
	
	public int getWinner()
	{
		for(Player player : this.getPlayers()){
			if(!gameState.isPlayerDead(player.getId())) return player.getId();
		}
		return -1;
	}

}
