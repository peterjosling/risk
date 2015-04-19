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
			((AIPlayer) player).initialiseGameState(playerInts);
		}
		
	}

	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
	@Override
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
	}


	public void run()
	{
		assignTerritories();
		
		// INITIAL DEPLOYMENT = STARTING ARMIES - TERRITORIES CAPTURED FOR EVERYONE...
		for(Player player : this.getPlayers()){
			((AIPlayer)player).getGameState().setDeployableArmies(this.getArmiesPerPlayer()); // PER PLAYER
		}
		while(!gameState.isGameComplete()){
			Player currentPlayer = nextTurn();
			playCards(currentPlayer);
			deploy(currentPlayer);
			String attack;
			do{
				// IF PLAYER CAN MAKE AN ATTACK THEN ASK...
				System.out.println("Do you wish to make an attack: Y/N");
				attack = EasyIn.getString();
				if(attack.equals("Y")) attack(getCurrentTurnPlayer());
			}while(attack.equals("Y"));
			fortify(currentPlayer);
			if(gameState.getAttackSuccessful()){
				drawCard(currentPlayer);
			}
			// CALCULATE DEPOLOYABLE ARMIES
		}
	}
}
