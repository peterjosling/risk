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
		
		LocalPlayer localPlayer = new LocalPlayer(0);
		playerInts.add(localPlayer.getId());
		addPlayer(new LocalPlayer(0));

		
		for (int i = 1; i < playerCount; i++) {
			Player player = new AIPlayer(i);
			playerInts.add(player.getId());
			addPlayer(player);
		}
		
		for(Player player : this.getPlayers()){
			player.initialiseGameState(playerInts);
		}
		
	}

	public void run()
	{
		assignTerritories();
		while(gameState.isGameComplete()){
			Player currentPlayer = nextTurn();
			playCards(currentPlayer);
			deploy(currentPlayer);
			String attack;
			do{
				System.out.println("Do you wish to make an attack: Y/N");
				attack = EasyIn.getString();
				attack(getCurrentTurnPlayer());
			}while(attack=="Y");
			fortify(currentPlayer);
			if(gameState.getAttackSuccessful()){
				drawCard(currentPlayer);
			}
		}
	}
}
