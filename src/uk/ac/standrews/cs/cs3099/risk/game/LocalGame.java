package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;

import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;

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
			((AIPlayer) player).initialiseGameState(playerInts);
		}
		
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
		Territory[] territories = ((AIPlayer)player).getGameState().getTerritoriesForPlayer(player.getId());
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
