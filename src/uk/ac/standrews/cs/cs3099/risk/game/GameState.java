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

	private int defDice;

	/**
	 * Given an id of a card in the hidden cards list return the instance of that card, if it exits
	 * @param id the id of the card
	 * @return the matching card
	 * @throws CardNotFoundException
	 */
	public Card getCardByID(int id, int playerId) throws CardNotFoundException{
		for(Card card: playerCards.get(playerId)){
			if(card.getId()==id){
				return card;
			}
		}
		throw new CardNotFoundException("Card Not Found");
	}
	
	/**
	 * Creates a game state with the provided list of players and start values for variables
	 * @param players - an array list of players who are in the game
	 */
	public GameState(ArrayList<Integer> players)
	{
		playerIDs = players;
		//deck = new Deck(DECK_SIZE);
		//deck.shuffle(TEMP_SEED);
		initTradeInValues();
		playerCards = new ArrayList<ArrayList<Card>>();
		
		for(int i = 0; i < players.size(); i ++){
			playerCards.add(new ArrayList<Card>());
		}
		playersDeployableArmies = new int[players.size()];
	}

	/**
	 * Loads a a given json map into the game state
	 * @param mapJSON
	 */
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

	/**
	 * Loads the default risk map into the game state
	 */
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

	/**
	 * @return the game state's map
	 */
	public Map getMap(){
		return map;
	}

	/**
	 * The number of armies received for each trade in i.e 4 at first then 6 at 2nd etc
	 */
	public void initTradeInValues(){
		TRADE_IN_VALUES[0] = 4;
		TRADE_IN_VALUES[1] = 6;
		TRADE_IN_VALUES[2] = 8;
		TRADE_IN_VALUES[3] = 10;
		TRADE_IN_VALUES[4] = 12;
		TRADE_IN_VALUES[5] = 15;
	}

	/**
	 * Checks whether a player is no longer in the game
	 * @param player the id of the player to check for
	 * @return true if player is dead, false if not
	 */
	public Boolean isPlayerDead(int player)
	{
		if(deadPlayers.contains(player)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Adds player to the ArrayList of dead player ids
	 * @param player the id of the player to be removed from the game
	 */
	public void addDeadPlayer(int player)
	{
		deadPlayers.add(player);
	}

	/**
	 * @return the total number of players in the game
	 */
	public int getNumberOfPlayers() {
		return playerIDs.size();
	}

	/**
	 * Removes the specified number of armies from a territory
	 * @param id the id of the territory
	 * @param armies the number of armies to remove
	 */
	public void removeArmiesFromTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.removeArmies(armies);
	}

	/**
	 * Adds the specified number of armies from a territory
	 * @param id the id of the territory
	 * @param armies the number of armies to remove
	 */
	public void addArmiesToTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.addArmies(armies);
	}

	/**
	 * Moves the specified number of armies from one territory to another
	 * @param from the source territory
	 * @param to the destination territory
	 * @param armies the number of armies to move
	 */
	public void moveArmies(int from, int to, int armies)
	{
		removeArmiesFromTerritory(from, armies);
		addArmiesToTerritory(to, armies);
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

	/**
	 * Returns the number of armies a specific player can deploy
	 * @param playerID the id of the player
	 * @return the number of armies the player can deploy
	 */
	public int getDeployableArmies(int playerID)
	{
		return playersDeployableArmies[playerID];
	}

	/**
	 * Calls play command for the specific command given which updates the games state appropriately
	 * @param command the command
	 */
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

	/**
	 * Updates the game state for an AssignArmiesCommand
	 * @param command
	 */
	public void playCommand(AssignArmyCommand command)
	{
		Territory territory = map.findTerritoryById(command.getTerritoryId());
		territory.addArmies(1);
		if(!territory.isClaimed()) territory.claim(command.getPlayerId());
	}

	/**
	 * Updates the game state for an FortifyCommand
	 * @param command
	 */
	public void playCommand(FortifyCommand command)
	{
		if(command.getFortifyDetails() == null) return;
		int source = command.getFortifyDetails()[0];
		int destination = command.getFortifyDetails()[1];
		int numberOfArmies = command.getFortifyDetails()[2];
		moveArmies(source, destination, numberOfArmies);
	}

	/**
	 * Updates the game state for an DeployCommand
	 * @param command
	 */
	public void playCommand(DeployCommand command)
	{
		DeployCommand.Deployment[] deployments = command.getDeployments();
		for(DeployCommand.Deployment deployment : deployments){
			int id = deployment.getTerritoryId();
			int armies = deployment.getArmies();
			addArmiesToTerritory(id, armies);
		}
	}

	/**
	 * Updates the game state for an AttackCommand taking all the other commands that make up an attack phase and
	 * using the information contained within them calculate and play out the result on the games state
	 * @param command the AttackCommand
	 */
	public void playCommand(AttackCommand command)
	{
		Logger.print("Attack command from " + command.getPlayerId());
		if(!inAttackPhase){
			attackPhaseCommands.add(command);
			lastAttackSuccessful = false;
			inAttackPhase = true;
		}

		try {
			if (attackPhaseCommands.size() == (2 + getNumberOfPlayers() * 2)) {
				Logger.print("Got all attack commands");
				Die die = new Die();

				int dieFaces = 6;
				int numberOfAttackingDice = command.getArmies();
				int numberOfDefendingDice = defDice;
				for (int commandIndex = 1; commandIndex < attackPhaseCommands.size(); commandIndex++) {
					Command phaseCommand = attackPhaseCommands.get(commandIndex);
					if (phaseCommand.getType() == CommandType.DEFEND) {
						numberOfDefendingDice = ((DefendCommand) phaseCommand).getArmies();
					}
					if (phaseCommand.getType() == CommandType.ROLL_HASH) {
						String hash = ((RollHashCommand) phaseCommand).getHash();
						//rollHashes.add(hash);

						Logger.print("Hash from " + phaseCommand.getPlayerId());
						die.addHash(phaseCommand.getPlayerId(), hash);
					}
					if (phaseCommand.getType() == CommandType.ROLL_NUMBER) {
						String rollNumberHash = ((RollNumberCommand) phaseCommand).getRollNumberHex(); // not a hash
						//rollNumbers.add(rollNumberHash);
						Logger.print("Number from " + phaseCommand.getPlayerId());
						die.addNumber(phaseCommand.getPlayerId(), rollNumberHash);
					}
				}
				//Die die = new Die(rollHashes, rollNumbers, dieFaces, numberOfAttackingDice+numberOfDefendingDice);
				Logger.print("Rolling dice for attack!");
				die.finalise();
				int[] resultingRolls = die.rollDiceNetwork(numberOfAttackingDice + numberOfDefendingDice);

				/// INFORMATION ONLY
				StringBuilder sb = new StringBuilder();
				for (int i = 0; i < resultingRolls.length; i++)
					sb.append(resultingRolls[i] + (i == resultingRolls.length - 1 ? "" : ", "));

				Logger.print("The rolls: " + sb);
				////////////////////

				int[] result = calculateResult(resultingRolls, numberOfAttackingDice, numberOfDefendingDice, command.getPlayerId());
				//apply result to board
				removeArmiesFromTerritory(command.getSource(), result[0]);
				removeArmiesFromTerritory(command.getDest(), result[1]);
				if (map.findTerritoryById(command.getDest()).getArmies() <= 0) {
					attackSuccessful = true;
					lastAttackSuccessful = true;
					remainingArmies = numberOfAttackingDice - result[0];
				}
				attackPhaseCommands.clear();
				inAttackPhase = false;
			}
		} catch (HashMismatchException e) {
			Logger.print("ERROR - Encountered error during distributed dice roll: " + e.getMessage());
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
				System.out.println("Adding attackRoll: " + rolls[roll]);
				attackingRolls[aRoll] = rolls[roll];
				aRoll++;
			} else if (dRoll<numberOfDefendingDice){
				System.out.println("Adding defendRoll: " + rolls[roll]);

				defendingRolls[dRoll] = rolls[roll];
				dRoll++;
			}
		}
		Arrays.sort(attackingRolls);
		Arrays.sort(defendingRolls);
		
		for(int i = 1; i <= Math.min(numberOfAttackingDice, numberOfDefendingDice); i ++){
			System.out.println("Roll: " + i + " Attacking Roll: " + attackingRolls[attackingRolls.length - i] + " Defending Roll: " + defendingRolls[defendingRolls.length - i]);

			if(attackingRolls[attackingRolls.length - i] <= defendingRolls[defendingRolls.length - i]){
				losses[0]++;
			} else {
				losses[1]++;
			}
		}
		return losses;
	}

	/**
	 * Adds the command to the list of command that are required for an attack
	 * @param command the defend command
	 */
	public void playCommand(DefendCommand command)
	{
		if(inAttackPhase) {
			attackPhaseCommands.add(command);
			defDice = command.getArmies();
		}
	}

	/**
	 * Adds the command to the list of command that are required for an attack
	 * @param command a Roll Hash command
	 */
	public void playCommand(RollHashCommand command)
	{
		if(inAttackPhase) {
			attackPhaseCommands.add(command);
		}
	}

	/**
	 * Adds the command to the list of command that are required for an attack
	 * @param command a Roll Numeber command
	 */
	public void playCommand(RollNumberCommand command)
	{
		if(inAttackPhase) {
			attackPhaseCommands.add(command);
		}
		if(attackPhaseCommands.size()==(2+getNumberOfPlayers()*2)){
			playCommand(attackPhaseCommands.get(0));
		}

	}

	/**
	 * Updates the game state for an AttackCaptureCommand
	 * @param command the attack capture command
	 */
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

	/**
	 * Updates the game state for an PlayCardsCommand
	 * @param command the play cards command
	 */
	public void playCommand(PlayCardsCommand command)
	{
		if(command.getCards() == null){
			return;
		}
		int[][] cards = command.getCards();
		Territory[] playersTerritories = getTerritoriesForPlayer(command.getPlayerId());
		int armies = calculateArmiesFromTradeIn();
		for(int[] cardSet:cards){
			for(int id:cardSet) {
				Card card = getCard(id);

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

	/**
	 * Draws a card from the top of the deck for a specified player
	 * @param playerID the id of the player who is drawing a card
	 */
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

	/**
	 * Updates the game state for an LeaveGameCommand
	 * @param command the leave game command
	 */
	public void playCommand(LeaveGameCommand command)
	{
		playerIDs.remove(command.getPlayerId());
	}

	/**
	 * Updates the game state when a player is timed out
	 * @param command the timeout command
	 */
	public void playCommand(TimeoutCommand command)
	{
		playerIDs.remove(command.getPlayerId());
	}

	/**
	 * Calculate the number of armies a player receives for a card trade in
	 * @return the number of armies received
	 */
	public int calculateArmiesFromTradeIn()
	{
		if(tradeInCount<=5){
			return TRADE_IN_VALUES[tradeInCount];
		}else {
			return ((tradeInCount-5)*5)+15; //5 additional armies to the previous set
		}
	}

	/**
	 * Checks whether a game is complete i.e. when one player owns all the territories in the game
	 * @return true if compelte, false if not
	 */
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

	/**
	 * Sets the number of armies a player can deploy
	 */
	public void setDeployableArmies()
	{
		for(int player : playerIDs){
			playersDeployableArmies[player] = calculateDeployArmies(player);
		}
	}

	/**
	 * Calculates the number of armies a player can deploy based solely on the territories they own
	 * @param playerId the id of the player to calculate for
	 * @return the number of deployable armies
	 */
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

	/**
	 * Checks whether a player owns the two specified territories and whether they are adjacent on the map
	 * @param playerId the id of the player
	 * @param source the source territory
	 * @param dest the destination territory
	 * @return true if they are belong to the player and connected, false if otherwise
	 */
	public boolean areOwnedTerritoriesConnected(int playerId, Territory source, Territory dest)
	{
		if(source == null || dest == null) return false;
		if(source.isLinkedTo(dest) && (source.getOwner() == playerId) && (dest.getOwner() == playerId)) return true;

		return false;
	}

	/**
	 * Checks whether a given command is allowed according to the rules
	 * @param command the command to validate
	 * @return true if valid, false if not
	 */
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

	/**
	 * Checks whether an AssignArmyCommand is valid
	 * @param command
	 * @return true if valid, false if not
	 */
	public boolean isCommandValid(AssignArmyCommand command)
	{
		int territoryId = command.getTerritoryId();
		if(territoryId > map.getTerritories().size() -1 || territoryId < 0) return false;
		Territory territory = map.findTerritoryById(territoryId);
		boolean allClaimed = getUnclaimedTerritories().length == 0;

		return (!allClaimed && !territory.isClaimed()) || (allClaimed && territory.getOwner() == command.getPlayerId());
	}

	/**
	 * Checks whether an Attack command is valid
	 * @param command
	 * @return true if valid, false if not
	 */
	public boolean isCommandValid(AttackCommand command)
	{
		if ((command.getSource() > map.getTerritories().size() - 1)
				|| (command.getDest() > map.getTerritories().size() - 1)
				|| (command.getDest() < 0) || (command.getSource() < 0))
			return false;
		
		int playerId = command.getPlayerId();
		Territory sourceTerritory = map.findTerritoryById(command.getSource());
		if(sourceTerritory.getOwner() != playerId) return false;

		Territory destTerritory = map.findTerritoryById(command.getDest());
		if(destTerritory.getOwner() == playerId) return false;

		if(!sourceTerritory.isLinkedTo(destTerritory)) return false;

		if ((sourceTerritory.getArmies() <= command.getArmies())
				|| (sourceTerritory.getArmies() < 2)
				|| (command.getArmies() > 3) || (command.getArmies() < 1))
			return false;

		return true;
	}

	/**
	 * Checks whether an FortifyCommand is valid
	 * @param command
	 * @return true if valid, false if not
	 */
	public boolean isCommandValid(FortifyCommand command)
	{
		if(command.getFortifyDetails() == null || command.getFortifyDetails()[2] == 0) return true;
		
		if ((command.getFortifyDetails()[0] > map.getTerritories().size() - 1)
				|| (command.getFortifyDetails()[1] > map.getTerritories()
						.size() - 1) || (command.getFortifyDetails()[0] < 0)
				|| (command.getFortifyDetails()[1] < 0))
			return false;
		
		int playerId = command.getPlayerId();

		Territory fortifySource = map.findTerritoryById(command.getFortifyDetails()[0]);
		if(fortifySource.getOwner() != playerId) return false;

		Territory fortifyDest = map.findTerritoryById(command.getFortifyDetails()[1]);
		if(fortifyDest.getOwner() != playerId) return false;

		if(fortifySource.getArmies() > 1){
			if ((command.getFortifyDetails()[2]) > fortifySource.getArmies()
					|| command.getFortifyDetails()[2] < 1)
				return false;
		} else {
			return false;
		}

		if(!areOwnedTerritoriesConnected(playerId, fortifySource, fortifyDest)) return false;

		return true;
	}

	/**
	 * Checks whether an DeployCommand is valid
	 * @param command
	 * @return true if valid, false if not
	 */
	public boolean isCommandValid(DeployCommand command)
	{
		int playerId = command.getPlayerId();
		int deployingTroops = 0;

		for (Deployment deployment : command.getDeployments()){
			if(deployment == null) return false;
			if ((deployment.getTerritoryId() > map.getTerritories().size())
					|| (deployment.getTerritoryId() < 0))
				return false;
			
			Territory deployTerritory = map.findTerritoryById(deployment.getTerritoryId());
			if(deployTerritory.getOwner() != playerId) return false;

			if(deployment.getArmies() < 1) return false;
			deployingTroops += deployment.getArmies();
		}
		if(deployingTroops != playersDeployableArmies[playerId]) return false;

		return true;
	}

	/**
	 * Checks whether an Defend Command is valid
	 * @param command
	 * @return true if valid, false if not
	 */
	public boolean isCommandValid(DefendCommand command)
	{
		if ((command.getArmies() < 1) || (command.getArmies() > 2))
			return false;
		return true;
	}

	/**
	 * Checks whether an AttackCapture Command is valid
	 * @param command
	 * @return true if valid, false if not
	 */
	public boolean isCommandValid(AttackCaptureCommand command)
	{
		int playerId = command.getPlayerId();

		if(command.getCaptureDetails() == null) return false;

		if ((command.getCaptureDetails()[0] > map.getTerritories().size() -1)
				|| (command.getCaptureDetails()[1] > map.getTerritories()
						.size() - 1) || (command.getCaptureDetails()[0] < 0)
				|| (command.getCaptureDetails()[1] < 0))
			return false;
		
		int[] captureDetails = command.getCaptureDetails();

		Territory sourceTerritory = map.findTerritoryById(captureDetails[0]);
		if(sourceTerritory.getOwner() != playerId) return false;

		Territory destTerritory = map.findTerritoryById(captureDetails[1]);
		if(destTerritory.getOwner() == playerId) return false;

		if ((sourceTerritory.getArmies() <= captureDetails[2])
				|| (captureDetails[2] < remainingArmies)
				|| (captureDetails[2] < 1))
			return false;

		return true;
	}

	/**
	 * Checks whether an PlayCards Command is valid
	 * @param command
	 * @return true if valid, false if not
	 */
	public boolean isCommandValid(PlayCardsCommand command)
	{
		int[][] cards = command.getCards();
		if(cards == null) return true;
		for(int[] cardSet : cards){
			if(cardSet.length != 3) return false;

			Card card1 = getCard(cardSet[0]);
			Card card2 = getCard(cardSet[1]);
			Card card3 = getCard(cardSet[2]);

			// All matching
			if ((card1.getCardType() == card2.getCardType())
					&& (card2.getCardType() == card3.getCardType()))
				return true;

			// All different
			if ((card1.getCardType() != card2.getCardType())
					&& (card1.getCardType() != card3.getCardType())
					&& (card2.getCardType() != card3.getCardType()))
				return true;

			// Any 2 Cards & 1 wild card
			if ((card1.getCardType() == CardType.WILD)
					|| (card2.getCardType() == CardType.WILD)
					|| (card3.getCardType() == CardType.WILD))
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

	/**
	 *
	 * @return true if the last attack that took place was successful, false if it failed
	 */
	public boolean getLastAttackSuccessful()
	{
		return lastAttackSuccessful;
	}

	/**
	 * Sets the number of armies a player can deploy to the specified number
	 * @param armies the number of armies
	 */
	public void setDeployableArmies(int armies)
	{
		for(int i = 0; i < playersDeployableArmies.length; i ++){
			playersDeployableArmies[i] = armies;
		}
	}

	/**
	 * Sets attack successful to the specified value
	 * @param attackSuccessful
	 */
	public void setAttackSuccessful(boolean attackSuccessful) 
	{
		this.attackSuccessful = attackSuccessful;
	}

	/**
	 * @return whether the attack was successful
	 */
	public boolean getAttackSuccessful()
	{
		return attackSuccessful;
	}

	/**
	 * Returns the number of armies remaining on a territory after an attack has taken place
	 * @return the number of armies
	 */
	public int getRemainingArmies()
	{
		return remainingArmies;
	}

	public void setDeckOrder(int[] deckOrder)
	{
		deck.setOrder(deckOrder);
	}

	public Card getCard(int id)
	{
		ArrayList<Card> cards = deck.getDeck();

		for (Card card : cards) {
			if (card.getId() == id) {
				return card;
			}
		}

		return null;
	}
}
