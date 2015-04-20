package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

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
		for(Player player : this.getPlayers()){
			switch (player.getType()) {
			case AI:
				((AIPlayer)player).getGameState().setDeployableArmies(1);
				break;
			case LOCAL:
				((LocalPlayer)player).getGameState().setDeployableArmies(1);
				break;				
			}
		}
		gameState.setDeployableArmies(1);
		
		Command command = null;

		int totalTurns = this.getArmiesPerPlayer() * this.getPlayers().size();
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
			switch (player.getType()) {
			case AI:
				((AIPlayer)player).getGameState().setDeployableArmies(0);
				break;
			case LOCAL:
				((LocalPlayer)player).getGameState().setDeployableArmies(0);
				break;				
			}
		}
		gameState.setDeployableArmies(0);
	}
	
	public void run()
	{
		int noOfTurns = 0;
	
		printMap();

		assignTerritories();
		boolean firstTurn = true;
		while(!gameState.isGameComplete()){
			if(noOfTurns%2 == 0){
				printMap();
				System.out.println("Press enter to continue.");
				String cont = EasyIn.getString();
			}
			
			Player currentPlayer = nextTurn();
			
			if(!gameState.isPlayerDead(currentPlayer.getId())){
				System.out.println("It is player " + currentPlayer.getId() + "'s turn.");
				if(firstTurn){
					firstTurn = false;
				} else {
					playCards(currentPlayer);
					deploy(currentPlayer);
				}
				boolean attackPhase = true;
				while(canPlayerAttack(currentPlayer) && attackPhase){
					//TODO fix now attack no longer returns boolean
					attack((AttackCommand) currentPlayer.getCommand(CommandType.ATTACK), getCurrentTurnPlayer());
				}
	
				fortify(currentPlayer);
				if(gameState.getAttackSuccessful()){
					drawCard(currentPlayer);

				}
				checkDeadPlayers();
				calcDeployable();
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

	public void calcDeployable()
	{
		for(Player player : this.getPlayers()){
			switch (player.getType()) {
			case AI:
				((AIPlayer)player).getGameState().setDeployableArmies();
				break;
			case LOCAL:
				((LocalPlayer)player).getGameState().setDeployableArmies();
				break;				
			}
		}
		gameState.setDeployableArmies();
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
