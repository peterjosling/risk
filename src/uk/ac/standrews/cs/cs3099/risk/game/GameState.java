package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.commands.AssignArmyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.DefendCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;
import uk.ac.standrews.cs.cs3099.risk.commands.DrawCardCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.PlayCardsCommand;


/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

	private Map map;
	private Deck deck;

	private int[] playersDeployableArmies;
	private int tradeInCount = 0;
	private ArrayList<Card>[] playerCards = new ArrayList[getNumberOfPlayers()];
	private boolean inAttackPhase = false;
	private ArrayList<Command> attackPhaseCommands = new ArrayList<Command>();
	private ArrayList<Integer> playerIDs;
	private final int[] TRADE_IN_VALUES = new int[6];

	private final int DECK_SIZE = 44;
	private final int TEMP_SEED = 123456;

	public GameState(ArrayList<Integer> players)
	{
		playerIDs = players;
		deck = new Deck(DECK_SIZE);
		deck.shuffle(TEMP_SEED);
		initTradeInValues();
	}

	public void loadMap(MapParser m) throws MapParseException
	{
		map = new Map(m);
	}

	public void initTradeInValues(){
		TRADE_IN_VALUES[0] = 4;
		TRADE_IN_VALUES[1] = 6;
		TRADE_IN_VALUES[2] = 8;
		TRADE_IN_VALUES[3] = 10;
		TRADE_IN_VALUES[4] = 12;
		TRADE_IN_VALUES[5] = 15;
	}

	public int getNumberOfPlayers() {
		return playerIDs.size();
	}

	public void removeArmiesForTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.removeArmies(armies);
	}

	public void addArmiesForTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.addArmies(armies);
	}

	public void moveArmies(int from, int to, int armies)
	{
		removeArmiesForTerritory(from, armies);
		addArmiesForTerritory(to, armies);
	}

	/**
	 * @return Array of {@link Territory} instances which have no owner.
	 */
	public Territory[] getUnclaimedTerritories()
	{
		return getTerritoriesForPlayer(-1);
	}

	/**
	 * Get all territories currently owned by a player.
	 * @param playerID ID of the player to find territories for.
	 * @return Array of {@link Territory}.
	 */
	public Territory[] getTerritoriesForPlayer(int playerID)
	{
		ArrayList<Territory> territories = new ArrayList<Territory>();

		for (Territory territory : map.getTerritories()) {
			if (territory.getOwner() == playerID) {
				territories.add(territory);
			}
		}

		return territories.toArray(new Territory[0]);
	}

	public int getDeployableArmies(int playerID)
	{
		return playersDeployableArmies[playerID];
	}


	public void playMove(Command command, int playerId){
		switch(command.getType()){
			case ASSIGN_ARMY:
				playMove((AssignArmyCommand) command, playerId);
			case ATTACK:
				playMove((AttackCommand) command, playerId);
			case FORTIFY:
				playMove((FortifyCommand) command, playerId);
			case DEPLOY:
				playMove((DeployCommand) command, playerId);
			case DRAW_CARD:
				playMove((DrawCardCommand) command, playerId);
			case DEFEND:
				playMove((DefendCommand) command, playerId);
			case TIMEOUT:
				playMove((TimeoutCommand) command, playerId);
			case ATTACK_CAPTURE:
				playMove((AttackCaptureCommand) command, playerId);
			case LEAVE_GAME:
				playMove((LeaveGameCommand) command, playerId);
			case PLAY_CARDS:
				playMove((PlayCardsCommand) command, playerId);
			case ROLL_NUMBER:
				playMove((RollNumberCommand) command, playerId);
			case ROLL:
				playMove((RollCommand) command, playerId);
			case ROLL_HASH:
				playMove((RollHashCommand) command, playerId);

		}
	}

	public void playMove(AssignArmyCommand move, int playerID){
		Territory territory = map.findTerritoryById(move.getTerritoryId());
		territory.addArmies(1);
		territory.claim(playerID);
	}

	public void playMove(FortifyCommand move){
		int destination = move.getDest();
		int source = move.getSource();
		int numberOfArmies = move.getArmies();
		moveArmies(source, destination, numberOfArmies);
	}

	public void playMove(DeployCommand move){
		DeployCommand.Deployment[] deployments = move.getDeployments();
		for(DeployCommand.Deployment deployment : deployments){
			int id = deployment.getTerritoryId();
			int armies = deployment.getArmies();
			addArmiesForTerritory(id, armies);
		}
	}

	public void playMove(AttackCommand move){
		inAttackPhase = true;
		while(!(attackPhaseCommands.size()==(3+getNumberOfPlayers()*2)));
		ArrayList<String> rollHashes = new ArrayList<String>();
		ArrayList<String> rollNumbers = new ArrayList<String>();
		int dieFaces = 0;
		int numberOfAttackingDice = 0;
		int numberOfDefendingDice = 0;
		boolean attackRoll = true;
		for(int moveIndex=1; moveIndex< attackPhaseCommands.size(); moveIndex++){ //index from 1 to avoid defend move
			Command phaseCommand = attackPhaseCommands.get(moveIndex);
			if(phaseCommand.getType() == CommandType.ROLL && attackRoll == true){
				dieFaces = ((RollCommand) phaseCommand).getNumberOfFaces();
				numberOfAttackingDice = ((RollCommand) phaseCommand).getNumberOfDice();
				attackRoll = false;
			}else if(phaseCommand.getType() == CommandType.ROLL && attackRoll == false){
				dieFaces = ((RollCommand) phaseCommand).getNumberOfFaces();
				numberOfDefendingDice = ((RollCommand) phaseCommand).getNumberOfDice();
			}
			if(phaseCommand.getType() == CommandType.ROLL_HASH){
				String hash = ((RollHashCommand) phaseCommand).getHash();
				rollHashes.add(hash);
			}
			if(phaseCommand.getType() == CommandType.ROLL_NUMBER){
				String rollNumberHash = ((RollNumberCommand) phaseCommand).getRollNumberHex();
				rollNumbers.add(rollNumberHash);
			}
		}
		Die die = new Die(rollHashes, rollNumbers, dieFaces, numberOfAttackingDice+numberOfDefendingDice);
		int[] resultingRolls = die.rollDice();
		int[] result = calculateResult(resultingRolls, numberOfAttackingDice, numberOfDefendingDice);
		//apply result to board
		removeArmiesForTerritory(move.getSource(), result[0]);
		removeArmiesForTerritory(move.getDest(), result[1]);
	}

	/**
	 * Calculates the number of armies lost by the attacker and defender using the dice rolls and
	 * returns them in an array.
	 * @param rolls
	 * @param numberOfAttackingDice
	 * @param numberOfDefendingDice
	 * @return int array with attacking losses at index 0 and defending losses at index 1
	 */
	public int[] calculateResult(int[] rolls, int numberOfAttackingDice, int numberOfDefendingDice){
		int[] attackingRolls = new int[numberOfAttackingDice];
		int[] defendingRolls = new int[numberOfDefendingDice];
		int aRoll = 0;
		int dRoll = 0;
		int[] losses = new int[2]; //attack lose, defend lose
		for(int roll =0; roll<rolls.length; roll++){
			while(aRoll<numberOfAttackingDice){
				attackingRolls[aRoll] = rolls[roll];
				aRoll++;
			}
			while(dRoll<numberOfDefendingDice){
				defendingRolls[aRoll] = rolls[roll];
				dRoll++;
			}
		}
		Arrays.sort(attackingRolls);
		Arrays.sort(defendingRolls);
		for(int i = Math.min(numberOfAttackingDice, numberOfDefendingDice); i>=0; i--){
			if(attackingRolls[i] < defendingRolls[i]){
				losses[0]++;;
			}
			if(attackingRolls[i] < defendingRolls[i]){
				losses[1]++;
			}
		}
		return losses;
	}

	public void playMove(DefendCommand move, int playerID){
		attackPhaseCommands.add(move);
	}

	public void playMove(RollCommand move, int playerID){
		attackPhaseCommands.add(move);
	}

	public void playMove(RollHashCommand move, int playerID){
		attackPhaseCommands.add(move);
	}

	public void playMove(RollNumberCommand move, int playerID){
		attackPhaseCommands.add(move);
	}

	public void playMove(AttackCaptureCommand move){
		int[] captureDetails = move.getCaptureDetails();
		int source = captureDetails[0];
		int destination = captureDetails[1];
		int armies = captureDetails[2];
		moveArmies(source, destination, armies);
	}

	public void playMove(PlayCardsCommand move, int playerID){
		Card[] cards = move.getCards();
		Territory[] playersTerritories = getTerritoriesForPlayer(playerID);
		int armies = calculateArmiesFromTradeIn();
		for(Card card:cards){
			for(Territory playerTerritory: playersTerritories){
				if(card.getTerritoryId()==playerTerritory.getId()){
					armies+=2; //this will need to be added to specific territory in future
					break;
				}
			}
			playerCards[playerID].remove(card);
		}
		playersDeployableArmies[playerID] += armies;
		tradeInCount++;
	}

	public void playMove(DrawCardCommand move, int playerID){
		Card drawnCard = deck.dealCard();
		playerCards[playerID].add(drawnCard);
	}

	public void playMove(LeaveGameCommand command, int playerID){
		for(Integer id:playerIDs){
			playerIDs.remove(command.getPlayerId());
		}
	}

	public void playMove(TimeoutCommand command, int PlayerId){
		for(Integer id:playerIDs){
			playerIDs.remove(command.getPlayerId());
		}
	}

	public int calculateArmiesFromTradeIn(){
		if(tradeInCount<=5){
			return TRADE_IN_VALUES[tradeInCount];
		}else {
			return ((tradeInCount-5)*5)+15; //5 additional armies to the previous set
		}
	}

	public boolean isGameComplete()
	{
		int player = -1;

		for (Territory territory : map.getTerritories()) {
			if (player == -1){
				player = territory.getOwner();
			} else if (territory.getOwner() != player) {
				return false;
			}
		}
		return true;
	}

	public int calculateDeployTroops(int playerId)
	{
		int deployableTroops = 0;
		
		// TERRITORIES
		int territoryCount = getTerritoriesForPlayer(playerId).length;

		if(territoryCount < 12){
			deployableTroops += 3;
		} else {
			deployableTroops += (territoryCount/3);
		}

		// CONTINENTS
		int continentTroops = 0;
		for(Continent continent : map.getContinents()){
			int continentOwned = 1;
			for(Territory territory : continent.getTerritories()){
				if (territory.getOwner() != playerId){
					continentOwned = -1;
					break;
				}
			}
			if (continentOwned == 1)
				continentTroops += continent.getContinentValue();
		}
		deployableTroops += continentTroops;

		return deployableTroops;
	}

	public boolean areOwnedTerritoriesConnected(int playerId, Territory source, Territory dest)
	{
		if(source.isLinkedTo(dest)) return true;

		for(Territory linkedTerritory : source.getLinkedTerritories()){
			if(linkedTerritory.getOwner() == playerId){
				return areOwnedTerritoriesConnected(playerId, linkedTerritory, dest);
			}
		}

		return false;
	}

	public boolean isMoveValid(Command command)
	{
		switch(command.getType()){
			case ASSIGN_ARMY:
				isMoveValid((AssignArmyCommand) command);
			case ATTACK:
				isMoveValid((AttackCommand) command);
			case FORTIFY:
				isMoveValid((FortifyCommand) command);
			case DEPLOY:
				isMoveValid((DeployCommand) command);
			case DRAW_CARD:
				isMoveValid((DrawCardCommand) command);
			case DEFEND:
				isMoveValid((DefendCommand) command);
//			case JOIN_GAME:
//				playMove((JoinGameCommand) command, playerId);
//			case ACCEPT_JOIN_GAME:
//				playMove((AcceptJoinGameCommand) command, playerId);
//			case REJECT_JOIN_GAME:
//				playMove((RejectJoinGameCommand) command, playerId);
//			case ACKNOWLEDGEMENT:
//				playMove((AcknowledgementCommand) command, playerId);
//			case TIMEOUT:
//				playMove((TimeoutCommand) command, playerId);
//			case ATTACK_CAPTURE:
//				playMove((AttackCaptureCommand) command, playerId);
//			case LEAVE_GAME:
//				playMove((LeaveGameCommand) command, playerId);
//			case PLAY_CARDS:
//				playMove((PlayCardsCommand) command, playerId);
//			case ROLL_NUMBER:
//				playMove((RollNumberCommand) command, playerId);
//			case ROLL:
//				playMove((RollCommand) command, playerId);
//			case ROLL_HASH:
//				playMove((RollHashCommand) command, playerId);
			default:
				System.out.println("Command not found");
		}
		
		return true;
		
		 		
	}

	public boolean isMoveValid(AssignArmyCommand move)
	{

		int territoryId = move.getTerritoryId();

		Territory territory = map.findTerritoryById(territoryId);

		if(territory.isClaimed()){
			return false;
		}

		return true;
	}
	
	public boolean isMoveValid(AttackCommand move)
	{

		int playerId = move.getPlayerId();

		Territory sourceTerritory = map.findTerritoryById(move.getSource());
		if(sourceTerritory.getOwner() != playerId) return false;

		Territory destTerritory = map.findTerritoryById(move.getDest());
		if(destTerritory.getOwner() == playerId) return false;

		if(!sourceTerritory.isLinkedTo(destTerritory)) return false;

		if ((sourceTerritory.getArmies() <= move.getArmies())
				|| (sourceTerritory.getArmies() < 2) || (move.getArmies() > 3))
			return false;

		return true;
	}

	public boolean isMoveValid(FortifyCommand move)
	{
		int playerId = move.getPlayerId();

		Territory fortifySource = map.findTerritoryById(move.getSource());
		if(fortifySource.getOwner() != playerId) return false;

		Territory fortifyDest = map.findTerritoryById(move.getDest());
		if(fortifyDest.getOwner() != playerId) return false;

		if(fortifySource.getArmies() > 1){
			if((move.getArmies()) < fortifySource.getArmies()) return false;
		} else {
			return false;
		}

		if(!areOwnedTerritoriesConnected(playerId, fortifySource, fortifyDest)) return false;

		return true;
	}



	public boolean isMoveValid(PlayCardsCommand move)
	{
		// Check if own cards trading in.
		return true;
	}

	public boolean isMoveValid(DeployCommand move)
	{
		int playerId = move.getPlayerId();

		int deployingTroops = 0;

		for (Deployment deployment : move.getDeployments()){

			Territory deployTerritory = map.findTerritoryById(deployment.getTerritoryId());
			if(deployTerritory.getOwner() != playerId) return false;

			deployingTroops += deployTerritory.getArmies();
		}
		
		if(deployingTroops != playersDeployableArmies[playerId]) return false;

		return true;
	}
	
	public boolean isMoveValid(DrawCardCommand move)
	{
		return true;
	}
	
	public boolean isMoveValid(DefendCommand move)
	{
		int playerId = move.getPlayerId();

		Territory defendTerritory = map.findTerritoryById(move.getTerritory());
		if(defendTerritory.getOwner() != playerId) return false;

		if ((defendTerritory.getArmies() < move.getArmies())
				|| (move.getArmies() > 2))
			return false;

		return true;
	}



}

