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

	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
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
		assignTerritories();
		boolean firstTurn = true;
		while(!gameState.isGameComplete()){
			Player currentPlayer = nextTurn();
			System.out.println("It is player " + currentPlayer.getId() + "'s turn.");
			if(firstTurn){
				firstTurn = false;
			} else {
				playCards(currentPlayer);
				deploy(currentPlayer);
			}
			String attack;
			if(canPlayerAttack(currentPlayer)){
				attack(getCurrentTurnPlayer());
			}
//			do{
//				// IF PLAYER CAN MAKE AN ATTACK THEN ASK...
//				System.out.println("Do you wish to make an attack: Y/N");
//				attack = EasyIn.getString();
//				if(attack.equals("Y")) attack(getCurrentTurnPlayer());
//			}while(attack.equals("Y"));
			fortify(currentPlayer);
			if(gameState.getAttackSuccessful()){
				drawCard(currentPlayer);
			}
			calcDeployable();
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
