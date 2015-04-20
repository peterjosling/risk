package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;
import uk.ac.standrews.cs.cs3099.risk.game.Card.CardType;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;


/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {
	private static final String DEFAULT_MAP = "www/default-map.json";

	private Map map;
	private Deck deck;

	private int[] playersDeployableArmies;
	private int tradeInCount = 0;
	private ArrayList<ArrayList<Card>> playerCards;
	private boolean inAttackPhase = false;
	private ArrayList<Command> attackPhaseCommands = new ArrayList<Command>();
	private ArrayList<Integer> playerIDs;
	private final int[] TRADE_IN_VALUES = new int[6];
	private boolean attackSuccessful = false;
	private boolean lastAttackSuccessful = false;
	private int remainingArmies = 0;
	private ArrayList<Integer> deadPlayers = new ArrayList<Integer>();

	private final int DECK_SIZE = 44;
	private final int TEMP_SEED = 123456;

	private int defDice;

	public GameState(ArrayList<Integer> players)
	{
		playerIDs = players;
		initTradeInValues();
		playerCards = new ArrayList<ArrayList<Card>>();
		
		for(int i = 0; i < players.size(); i ++){
			playerCards.add(new ArrayList<Card>());
		}
		playersDeployableArmies = new int[players.size()];
	}

	public void loadMap(String mapJSON)
	{
		try {
			MapParser mp = new MapParser(mapJSON);

			map = new Map(mp);
			deck = mp.getDeck();
		} catch (MapParseException e) {
			Logger.print("ERROR - Problem parsing map, " + e.getMessage());
			System.exit(-1);
		}
	}
	
	public void loadDefaultMap()
	{
		String json = "";

		try {
			BufferedReader reader = new BufferedReader(new FileReader(DEFAULT_MAP));
			String line;

			while ((line = reader.readLine()) != null) {
				json += line;
			}

			reader.close();
		} catch (FileNotFoundException e) {
			System.err.println("Couldn't find default map JSON file");
			System.exit(1);
		} catch (IOException e) {
			System.err.println("Failed to read from input JSON file");
			System.exit(1);
		}

		loadMap(json);
	}

	public Map getMap(){
		return map;
	}

	public void initTradeInValues(){
		TRADE_IN_VALUES[0] = 4;
		TRADE_IN_VALUES[1] = 6;
		TRADE_IN_VALUES[2] = 8;
		TRADE_IN_VALUES[3] = 10;
		TRADE_IN_VALUES[4] = 12;
		TRADE_IN_VALUES[5] = 15;
	}

	public Boolean isPlayerDead(int player)
	{
		if(deadPlayers.contains(player)) {
			return true;
		} else {
			return false;
		}
	}
	
	public void addDeadPlayer(int player)
	{
		deadPlayers.add(player);
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


	public void playCommand(Command command)
	{
		switch(command.getType()){
			case ASSIGN_ARMY:
				playCommand((AssignArmyCommand) command);
				break;
			case ATTACK:
				playCommand((AttackCommand) command);
				break;
			case FORTIFY:
				playCommand((FortifyCommand) command);
				break;
			case DEPLOY:
				playCommand((DeployCommand) command);
				break;
			case DEFEND:
				playCommand((DefendCommand) command);
				break;
			case TIMEOUT:
				playCommand((TimeoutCommand) command);
				break;
			case ATTACK_CAPTURE:
				playCommand((AttackCaptureCommand) command);
				break;
			case LEAVE_GAME:
				playCommand((LeaveGameCommand) command);
				break;
			case PLAY_CARDS:
				playCommand((PlayCardsCommand) command);
				break;
			case ROLL_NUMBER:
				playCommand((RollNumberCommand) command);
				break;
			case ROLL_HASH:
				playCommand((RollHashCommand) command);
				break;
		default:
			break;
		}
	}

	public void playCommand(AssignArmyCommand command)
	{
		Territory territory = map.findTerritoryById(command.getTerritoryId());
		territory.addArmies(1);
		if(!territory.isClaimed()) territory.claim(command.getPlayerId());
	}

	public void playCommand(FortifyCommand command)
	{
		if(command.getFortifyDetails()[2] == 0) return;
		int source = command.getFortifyDetails()[0];
		int destination = command.getFortifyDetails()[1];
		int numberOfArmies = command.getFortifyDetails()[2];
		moveArmies(source, destination, numberOfArmies);
	}

	public void playCommand(DeployCommand command)
	{
		DeployCommand.Deployment[] deployments = command.getDeployments();
		for(DeployCommand.Deployment deployment : deployments){
			int id = deployment.getTerritoryId();
			int armies = deployment.getArmies();
			addArmiesForTerritory(id, armies);
		}
	}

	public void playCommand(AttackCommand command)
	{
		if(!inAttackPhase){
			attackPhaseCommands.add(command);
		}
		lastAttackSuccessful = false;
		inAttackPhase = true;
		if(attackPhaseCommands.size()==(2+getNumberOfPlayers()*2)){
			ArrayList<String> rollHashes = new ArrayList<String>();
			ArrayList<String> rollNumbers = new ArrayList<String>();
			int dieFaces = 6;
			int numberOfAttackingDice = command.getArmies();
			int numberOfDefendingDice = defDice;
			for(int commandIndex=1; commandIndex< attackPhaseCommands.size(); commandIndex++){
				Command phaseCommand = attackPhaseCommands.get(commandIndex);
				if(phaseCommand.getType() == CommandType.DEFEND){
					numberOfDefendingDice = ((DefendCommand) phaseCommand).getArmies();
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
			int[] result = calculateResult(resultingRolls, numberOfAttackingDice, numberOfDefendingDice, command.getPlayerId());
			//apply result to board
			removeArmiesForTerritory(command.getSource(), result[0]);
			removeArmiesForTerritory(command.getDest(), result[1]);
			if(map.findTerritoryById(command.getDest()).getArmies() == 0){
				attackSuccessful = true;
				lastAttackSuccessful = true;
				remainingArmies = numberOfAttackingDice-result[0];
			}
			attackPhaseCommands.clear();
			inAttackPhase = false;
		}
	}

	/**
	 * Calculates the number of armies lost by the attacker and defender using the dice rolls and
	 * returns them in an array.
	 * @param rolls
	 * @param numberOfAttackingDice
	 * @param numberOfDefendingDice
	 * @return int array with attacking losses at index 0 and defending losses at index 1
	 */
	public int[] calculateResult(int[] rolls, int numberOfAttackingDice, int numberOfDefendingDice, int player)
	{
		int[] attackingRolls = new int[numberOfAttackingDice];
		int[] defendingRolls = new int[numberOfDefendingDice];
		int aRoll = 0;
		int dRoll = 0;
		int[] losses = new int[2]; //attack lose, defend lose
		for(int roll =0; roll<rolls.length; roll++){
			if(aRoll<numberOfAttackingDice){
				attackingRolls[aRoll] = rolls[roll];
				aRoll++;
			} else if (dRoll<numberOfDefendingDice){
				defendingRolls[dRoll] = rolls[roll] - 1;
				dRoll++;
			}
		}
		Arrays.sort(attackingRolls);
		Arrays.sort(defendingRolls);
		for(int i = Math.min(numberOfAttackingDice, numberOfDefendingDice) -1; i>=0; i--){
			if(attackingRolls[i] <= defendingRolls[i]){
				losses[0]++;
			} else {
				losses[1]++;
			}
		}
		return losses;
	}

	public void playCommand(DefendCommand command)
	{
		if(inAttackPhase) {
			attackPhaseCommands.add(command);
			defDice = command.getArmies();
		}
	}

	public void playCommand(RollHashCommand command)
	{
		if(inAttackPhase) {
			attackPhaseCommands.add(command);
		}
	}

	public void playCommand(RollNumberCommand command)
	{
		if(inAttackPhase) {
			attackPhaseCommands.add(command);
		}
		if(attackPhaseCommands.size()==(2+getNumberOfPlayers()*2)){
			playCommand(attackPhaseCommands.get(0));
		}

	}

	public void playCommand(AttackCaptureCommand command)
	{
		int[] captureDetails = command.getCaptureDetails();
		int source = captureDetails[0];
		int destination = captureDetails[1];
		int armies = captureDetails[2];
		moveArmies(source, destination, armies);
		Territory territory = map.findTerritoryById(destination);
		territory.claim(command.getPlayerId());
	}

	public void playCommand(PlayCardsCommand command)
	{
		if(command.getCards() == null){
			return;
		}
		Card[][] cards = command.getCards();
		Territory[] playersTerritories = getTerritoriesForPlayer(command.getPlayerId());
		int armies = calculateArmiesFromTradeIn();
		for(Card[] cardSet:cards){
			for(Card card:cardSet) {
				for (Territory playerTerritory : playersTerritories) {
					if (card.getTerritoryId() == playerTerritory.getId()) {
						armies += 2; //this will need to be added to specific territory in future
						break;
					}
				}
				playerCards.get(command.getPlayerId()).remove(card);
			}
		}
		playersDeployableArmies[command.getPlayerId()] += armies;
		tradeInCount++;
	}

	public Card drawCard(int playerID)
	{
		if(deck.getTopCardIndex() < 44){
			System.out.println("Card Drawn: " + deck.getTopCardIndex());
			Card drawnCard = deck.dealCard();
			playerCards.get(playerID).add(drawnCard);
			return drawnCard;
		} else {
			System.out.println("No Card Drawn.");
			return null;
		}
	}

	public void playCommand(LeaveGameCommand command)
	{
		playerIDs.remove(command.getPlayerId());
	}

	public void playCommand(TimeoutCommand command)
	{
		playerIDs.remove(command.getPlayerId());
	}

	public int calculateArmiesFromTradeIn()
	{
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
	
	public void setDeployableArmies()
	{
		for(int player : playerIDs){
			playersDeployableArmies[player] = calculateDeployArmies(player);
		}
	}

	public int calculateDeployArmies(int playerId)
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
		if(source == null || dest == null) return false;
		if(source.isLinkedTo(dest) && (source.getOwner() == playerId) && (dest.getOwner() == playerId)) return true;

		return false;
	}

	public boolean isCommandValid(Command command)
	{
		switch(command.getType()){
			case ASSIGN_ARMY:
				return isCommandValid((AssignArmyCommand) command);
			case ATTACK:
				return isCommandValid((AttackCommand) command);
			case FORTIFY:
				return isCommandValid((FortifyCommand) command);
			case DEPLOY:
				return isCommandValid((DeployCommand) command);
			case DEFEND:
				return isCommandValid((DefendCommand) command);
			case TIMEOUT:
				return isCommandValid((TimeoutCommand) command);
			case ATTACK_CAPTURE:
				return isCommandValid((AttackCaptureCommand) command);
			case LEAVE_GAME:
				return isCommandValid((LeaveGameCommand) command);
			case PLAY_CARDS:
				return isCommandValid((PlayCardsCommand) command);
			case ROLL_NUMBER:
				return isCommandValid((RollNumberCommand) command);
			case ROLL_HASH:
				return isCommandValid((RollHashCommand) command);

			default:
				System.out.println("Command not found");
		}
		return true;
	}

	public boolean isCommandValid(AssignArmyCommand command)
	{
		int territoryId = command.getTerritoryId();
		if(territoryId > map.getTerritories().size() -1) return false;
		Territory territory = map.findTerritoryById(territoryId);
		boolean allClaimed = getUnclaimedTerritories().length == 0;

		return (!allClaimed && !territory.isClaimed()) || (allClaimed && territory.getOwner() == command.getPlayerId());
	}

	public boolean isCommandValid(AttackCommand command)
	{
		if ((command.getSource() > map.getTerritories().size() -1)
				|| (command.getDest() > map.getTerritories().size() -1))
			return false;
		
		int playerId = command.getPlayerId();
		Territory sourceTerritory = map.findTerritoryById(command.getSource());
		if(sourceTerritory.getOwner() != playerId) return false;

		Territory destTerritory = map.findTerritoryById(command.getDest());
		if(destTerritory.getOwner() == playerId) return false;

		if(!sourceTerritory.isLinkedTo(destTerritory)) return false;

		if ((sourceTerritory.getArmies() <= command.getArmies())
				|| (sourceTerritory.getArmies() < 2) || (command.getArmies() > 3))
			return false;

		return true;
	}

	public boolean isCommandValid(FortifyCommand command)
	{
		if(command.getFortifyDetails()[2] == 0) return true;
		
		if ((command.getFortifyDetails()[0] > map.getTerritories().size() -1)
				|| (command.getFortifyDetails()[1] > map.getTerritories().size() -1))
			return false;
		
		int playerId = command.getPlayerId();

		Territory fortifySource = map.findTerritoryById(command.getFortifyDetails()[0]);
		if(fortifySource.getOwner() != playerId) return false;

		Territory fortifyDest = map.findTerritoryById(command.getFortifyDetails()[1]);
		if(fortifyDest.getOwner() != playerId) return false;

		if(fortifySource.getArmies() > 1){
			if((command.getFortifyDetails()[2]) > fortifySource.getArmies()) return false;
		} else {
			return false;
		}

		if(!areOwnedTerritoriesConnected(playerId, fortifySource, fortifyDest)) return false;

		return true;
	}

	public boolean isCommandValid(DeployCommand command)
	{
		int playerId = command.getPlayerId();
		int deployingTroops = 0;

		for (Deployment deployment : command.getDeployments()){

			if(deployment.getTerritoryId() > map.getTerritories().size() -1) return false;
			
			Territory deployTerritory = map.findTerritoryById(deployment.getTerritoryId());
			if(deployTerritory.getOwner() != playerId) return false;

			deployingTroops += deployment.getArmies();
		}
		if(deployingTroops != playersDeployableArmies[playerId]) return false;

		return true;
	}

	public boolean isCommandValid(DefendCommand command)
	{
		//TODO work out how to check this command without territory id
//		int playerId = command.getPlayerId();
//
//		Territory defendTerritory = map.findTerritoryById(command.getTerritory());
//		if(defendTerritory.getOwner() != playerId) return false;
//
//		if ((defendTerritory.getArmies() < command.getArmies())
//				|| (command.getArmies() > 2))
//			return false;

		return true;
	}

	public boolean isCommandValid(AttackCaptureCommand command)
	{
		int playerId = command.getPlayerId();

		if ((command.getCaptureDetails()[0] > map.getTerritories().size() -1)
				|| (command.getCaptureDetails()[1] > map.getTerritories().size() -1))
			return false;
		
		int[] captureDetails = command.getCaptureDetails();

		Territory sourceTerritory = map.findTerritoryById(captureDetails[0]);
		if(sourceTerritory.getOwner() != playerId) return false;

		Territory destTerritory = map.findTerritoryById(captureDetails[1]);
		if(destTerritory.getOwner() == playerId) return false;

		if((sourceTerritory.getArmies() <= captureDetails[2]) || (captureDetails[2] < remainingArmies)) return false;

		return true;
	}

	public boolean isCommandValid(PlayCardsCommand command)
	{
		Card[][] cards = command.getCards();
		if(cards == null) return true;
		for(Card[] cardSet : cards){
			if(cardSet.length != 3) return false;

			// All matching
			if ((cardSet[0].getCardType() == cardSet[1].getCardType())
					&& (cardSet[1].getCardType() == cardSet[2].getCardType()))
				return true;

			// All different
			if ((cardSet[0].getCardType() != cardSet[1].getCardType())
					&& (cardSet[0].getCardType() != cardSet[2].getCardType())
					&& (cardSet[1].getCardType() != cardSet[2].getCardType()))
				return true;

			// Any 2 Cards & 1 wild card
			if ((cardSet[0].getCardType() == CardType.WILD)
					|| (cardSet[1].getCardType() == CardType.WILD)
					|| (cardSet[2].getCardType() == CardType.WILD))
				return true;
		}
		return false;
	}

	public boolean isCommandValid(RollHashCommand command)
	{
		return true;
	}

	public boolean isCommandValid(RollNumberCommand command)
	{
		// Compare with previous RollHash
		return true;
	}

	public boolean isCommandValid(TimeoutCommand command)
	{
		// TODO
		return true;
	}

	public boolean isCommandValid(LeaveGameCommand command)
	{
		// TODO
		return true;
	}

	public boolean getLastAttackSuccessful()
	{
		return lastAttackSuccessful;
	}
	
	public void setDeployableArmies(int armies)
	{
		for(int i = 0; i < playersDeployableArmies.length; i ++){
			playersDeployableArmies[i] = armies;
		}
	}
	
	public void setAttackSuccessful(boolean attackSuccessful) 
	{
		this.attackSuccessful = attackSuccessful;
	}

	public boolean getAttackSuccessful()
	{
		return attackSuccessful;
	}
	
	public int getRemainingArmies()
	{
		return remainingArmies;
	}
}

