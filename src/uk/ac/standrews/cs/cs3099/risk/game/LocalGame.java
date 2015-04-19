package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;

import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

public class LocalGame extends AbstractGame {
	public LocalGame(String jsonMap, int playerCount, int armiesPerPlayer) throws MapParseException
	{
		super(armiesPerPlayer);
		
		initialise(playerCount);
		this.init();
//		this.loadMap(jsonMap);
	}
	
	public LocalGame(int playerCount, int armiesPerPlayer)
	{
		super(armiesPerPlayer);

		initialise(playerCount);
		this.init();
//		loadDefaultMap();
	}
	
	
	public void initialise(int playerCount)
	{
		ArrayList<Integer> playerInts = new ArrayList<Integer>();
		
//		LocalPlayer localPlayer = new LocalPlayer(0);
//		playerInts.add(localPlayer.getId());
//		addPlayer(new LocalPlayer(0));

		
		for (int i = 0; i < playerCount; i++) {
			Player player = new AIPlayer(i);
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

	public void run()
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
		assignTerritories();
		boolean firstTurn = true;
		while(!gameState.isGameComplete()){
			if(noOfTurns%5 == 0){
				printMap();
				System.out.println("Enter anything to continue.");
				String cont = EasyIn.getString();
			}
			Player currentPlayer = nextTurn();
			System.out.println("It is player " + currentPlayer.getId() + "'s turn.");
			if(firstTurn){
				firstTurn = false;
			} else {
				playCards(currentPlayer);
				deploy(currentPlayer);
			}
			String attack;
			boolean attackPhase = true;
			while(canPlayerAttack(currentPlayer) && attackPhase){
				attackPhase = attack(getCurrentTurnPlayer());
			}

			fortify(currentPlayer);
			if(gameState.getAttackSuccessful()){
				drawCard(currentPlayer);
			}
			calcDeployable();
			noOfTurns++;
		}
	}
	
	public void printMap(){
		Map map = this.gameState.getMap();
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
	}
	
	public boolean canPlayerAttack(Player player){
		Territory[] territories = null;
		switch (player.getType()) {
			case AI:
				territories = ((AIPlayer)player).getGameState().getTerritoriesForPlayer(player.getId());
				break;
			case LOCAL:
				territories = ((LocalPlayer)player).getGameState().getTerritoriesForPlayer(player.getId());
				break;				
		}
		
		for(Territory territory : territories){
			for(Territory linkedTerritory : territory.getLinkedTerritories()){
				if((linkedTerritory.getOwner() != player.getId()) && (territory.getArmies() > 1)){
					return true;
				}
			}
		}
		return false;
	}
}
