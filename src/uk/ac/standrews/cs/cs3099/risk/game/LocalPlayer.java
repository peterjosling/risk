package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;

import java.util.ArrayList;
import java.util.List;

public class LocalPlayer extends Player {
	private GameState gameState;
	private int attackSourceId;
	private int attackDestId;
	
	@Override
	public PlayerType getType()
	{
		return PlayerType.LOCAL;
	}

	/**
	 * Create a LocalPlayer without a name
	 * @param id the player id
	 */
	public LocalPlayer(int id)
	{
		super(id);
	}

	/**
	 * Create a local player with a name
	 * @param id the player id
	 * @param name the name of the player
	 */
	public LocalPlayer(int id, String name)
	{
		super(id, name);
	}

	/**
	 * Initialises the game state with a default map and a list of player ids
	 * @param playerInts - ArrayList of player ids
	 */
	public void initialiseGameState(ArrayList<Integer> playerInts)
	{
		gameState = new GameState(playerInts);
		gameState.loadDefaultMap();
	}

	/**
	 * @return the players copy of the gamestate
	 */
	public GameState getGameState()
	{
		return gameState;
	}

	/**
	 * Orchestrates the getCommand methods for each command, creating commands taking deatials from a player
	 * via the command line.
	 * @param type - the type of command
	 * @return - the newly created command
	 */
	@Override
	public Command getCommand(CommandType type) 
	{
		switch (type) {
			case ASSIGN_ARMY:
				return getAssignArmyCommand();
			case ATTACK:
				return getAttackCommand();
			case FORTIFY:
				return getFortifyCommand();
			case DEPLOY:
				return getDeployCommand();
			case DEFEND:
				return getDefendCommand();
			case JOIN_GAME:
				return getJoinGameCommand();
			case ACCEPT_JOIN_GAME:
				return getAcceptJoinGameCommand();
			case REJECT_JOIN_GAME:
				return getRejectJoinGameCommand();
			case ACKNOWLEDGEMENT:
				return getAcknowledgementCommand();
			case TIMEOUT:
				return getTimeoutCommand();
			case ATTACK_CAPTURE:
				return getAttackCaptureCommand();
			case LEAVE_GAME:
				return getLeaveGameCommand();
			case PLAY_CARDS:
				return getPlayCardsCommand();
			case ROLL_NUMBER:
				return getRollNumberCommand();
			case ROLL_HASH:
				return getRollHashCommand();
			case PING:
				return getPingCommand();
			case READY:
				return getReadyCommand();
			case INITIALISE_GAME:
				return getInitialiseGameCommand();
			default:
				return getLeaveGameCommand();
		}
	}

	/**
	 * Creates an AssignArmy command
	 * @return the command
	 */
	public Command getAssignArmyCommand()
	{
		Territory[] territories = null;
		if(gameState.getUnclaimedTerritories().length == 0){
			System.out.print("Your Territories: ");
			territories = gameState.getTerritoriesForPlayer(this.getId());
		} else {
			System.out.print("Free Territories: ");
			territories = gameState.getUnclaimedTerritories();
		}
		for(Territory territory : territories){
			System.out.print(territory.getId() + " ");
		}
		System.out.println();
		if(gameState.getUnclaimedTerritories().length == 0){
			System.out.println("Choose Territory to Reinforce. Enter Territory ID:");
		} else {
			System.out.println("Choose Territory to Assign Army. Enter Territory ID:");
		}
		int territoryID = EasyIn.getInt();
		AssignArmyCommand command = new AssignArmyCommand(this.getId(), lastAckid++, territoryID);
		if(gameState.isCommandValid(command)){
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getAssignArmyCommand();
		}
	}

	/**
	 * Creates an attack command.
	 * @return the new AttackCommand
	 */
	public Command getAttackCommand()
	{
		if(canPlayerAttack()){
			System.out.println("Do you desire to make an attack? (Y/N)");
			String response = EasyIn.getString();
			if(response.equals("N")) return getFortifyCommand();
			System.out.println("Choose Territory to Attack From. Enter Territory ID:");
			int sourceID = EasyIn.getInt();
			System.out.println("Choose Territory to Attack. Enter Territory ID:");
			int destinationID = EasyIn.getInt();
			System.out.println("Enter number of armies to attack with:");
			int armies = EasyIn.getInt();
			AttackCommand command = new AttackCommand(this.getId(), lastAckid++, sourceID, destinationID, armies);
			if(gameState.isCommandValid(command)) {
				notifyCommand(command);
				return command;
			} else {
				System.out.println("Invalid Command, please try again.");
				return getAttackCommand();
			}
		} else {
			System.out.println("Unable to make an attack.");
			return getFortifyCommand();
		}
	}

	/**
	 * Creates a new Fortify command
	 * @return new Fortify Command
	 */
	public Command getFortifyCommand()
	{
		FortifyCommand command = null;
		System.out.println("Do you with to fortify?. (Y/N)");
		String response = EasyIn.getString();
		if(response.equals("Y")){
			System.out.println("Choose Territory to Fortify from. Enter Territory ID:");
			int sourceID = EasyIn.getInt();
			System.out.println("Choose Territory to Fortify. Enter Territory ID:");
			int destinationID = EasyIn.getInt();
			System.out.println("Enter number of armies to fortify with:");
			int armies = EasyIn.getInt();
			int[] details = {sourceID, destinationID, armies};
			command = new FortifyCommand(this.getId(), lastAckid++, details);
		} else {
			command = new FortifyCommand(this.getId(), lastAckid++);
		}
		if(gameState.isCommandValid(command)) {
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getFortifyCommand();
		}
	}

	/**
	 * Creates a deployment command
	 * @return the new deployment command
	 */
	public Command getDeployCommand()
	{
		System.out.print("Your owned territories: ");
		for(Territory territory : gameState.getTerritoriesForPlayer(this.getId())){
			System.out.print(territory.getId() + " ");
		}
		System.out.println();
		System.out.println("Deployable armies: " + gameState.getDeployableArmies(this.getId()));
		int numberOfDeployments;
		int territoryID;
		int armies;
		DeployCommand.Deployment[] deployments = null;

		System.out.println("Enter number of deployments:");
		numberOfDeployments = EasyIn.getInt();

		while(numberOfDeployments > gameState.getDeployableArmies(this.getId())){
			System.out.println("Invalid number of deployments. Please try again.");
			numberOfDeployments = EasyIn.getInt();
		}

		deployments = new DeployCommand.Deployment[numberOfDeployments];
		for(int i=0; i<numberOfDeployments; i++){
			System.out.println("Choose Territory To Deploy to. Enter Territory ID:");
			territoryID = EasyIn.getInt();
			System.out.println("Enter number of armies to deploy here:");
			armies = EasyIn.getInt();
			deployments[i] = new DeployCommand.Deployment(territoryID, armies);
		}
		
		DeployCommand command = new DeployCommand(this.getId(), lastAckid++, deployments);
		if(gameState.isCommandValid(command)) {
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getDeployCommand();
		}
	}

	/**
	 * Creates a DefendCommand
	 * @return creates a new defend command
	 */
	public Command getDefendCommand()
	{
		int availableArmies = gameState.getMap().findTerritoryById(this.attackDestId).getArmies();
		System.out.println(availableArmies + " armies available. Enter number of armies to defend with:");
		int armies = EasyIn.getInt();
		while(armies > availableArmies || armies < 1){
			System.out.println("Invalid number of armies. " +availableArmies + " armies available. Enter number of armies to defend with:");
			armies = EasyIn.getInt();
		}
		DefendCommand command = new DefendCommand(this.getId(), lastAckid++, armies);
		if(gameState.isCommandValid(command)) {
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getDefendCommand();
		}
	}

	/**
	 * Creates a join game command
	 * @return - the new JoinGameCommand
	 */
	public Command getJoinGameCommand()
	{
		float[] supportedVersions = {1};
		String[] supportedFeatures = {};
		JoinGameCommand command = new JoinGameCommand(supportedVersions, supportedFeatures);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates an accept game command
	 * @return the new AcceptGameCommand
	 */
	public Command getAcceptJoinGameCommand()
	{
		int ackTimeout = 4; //Check these values
		int moveTimeout = 30;
		AcceptJoinGameCommand command = new AcceptJoinGameCommand(this.getId(), ackTimeout, moveTimeout);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates a RejectGame Command
	 * @return the new RejectGameCommand
	 */
	public Command getRejectJoinGameCommand()
	{
		String message = "Game in progress";
		RejectJoinGameCommand command = new RejectJoinGameCommand(message);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates an Acknowledgement command
	 * @return the new AcknowledgementCommand
	 */
	public Command getAcknowledgementCommand(){
		AcknowledgementCommand command = new AcknowledgementCommand(this.getId(), lastAckid++);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates a TimeoutCommand
	 * @return the new TimeoutCommand
	 */
	public Command getTimeoutCommand()
	{
		int timedOutPlayerId = EasyIn.getInt();
		TimeoutCommand command = new TimeoutCommand(this.getId(), lastAckid++, timedOutPlayerId);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates an AttackCaptureCommand
	 * @return the new AttackCapture Command
	 */
	public Command getAttackCaptureCommand()
	{
		int minArmies = gameState.getRemainingArmies();
		int maxArmies = gameState.getMap().findTerritoryById(attackSourceId).getArmies() - 1;
		System.out.println("How many armies do you desire to capture with? Between " + minArmies + " and " + maxArmies + ".");
		int armies = EasyIn.getInt();
		int[] captureDetails = {attackSourceId,attackDestId,armies};
		AttackCaptureCommand command = new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
		if(gameState.isCommandValid(command)) {
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getAttackCaptureCommand();
		}
	}

	/**
	 * Creates a LeaveGameCommand
	 * @return the new LeaveGameCommand
	 */
	public Command getLeaveGameCommand()
	{
		int response = EasyIn.getInt();
		String updates = "";
		boolean receiveUpdates = false;
		do{
			System.out.println("Would you like to receive game updates? Please Enter: 'Y' or 'N'");
			updates = EasyIn.getString();
			if(updates=="Y"){
				receiveUpdates = true;
			} else if(updates=="N"){
				receiveUpdates = false;
			}
		}while(updates!="Y" || updates!="N");
		LeaveGameCommand command = new LeaveGameCommand(this.getId(), lastAckid++, response, "", receiveUpdates);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates a PlayCardCommand
	 * @return the new PlayCardsCommand
	 */
	public Command getPlayCardsCommand()
	{
		PlayCardsCommand command = null;
		gameState.setDeployableArmies();
		List<Card> playersCards = getCards();
		if(playersCards.size() != 0){
			System.out.println("Your Cards:");
			for(Card card:playersCards){
				System.out.println("Card ID: "+ card.getId() + " Territory ID: " +
						card.getTerritoryId() + " Card Type: " + card.getCardType());
			}
			System.out.println("Select number of card sets to trade in:");
			int numberOfTradeIns = EasyIn.getInt();
			if(numberOfTradeIns == 0){
				command = new PlayCardsCommand(this.getId(), lastAckid++);
			} else {
				Card[][] cards = new Card[numberOfTradeIns][3];
				int cardId;
				for(int i =0; i<numberOfTradeIns; i++){
					System.out.println("Select 3 cards to trade in:");
					for(int j=0; j<cards[i].length; j++) {
						System.out.println("Enter Card ID:");
						cardId = EasyIn.getInt();
						try {
							cards[i][j] = getCardByID(cardId);
						} catch (CardNotFoundException e) {
							System.out.println("Card not found please enter another ID");
							j--;
						}
					}
				}
				command = new PlayCardsCommand(this.getId(), lastAckid++, cards);
			}
		} else {
			System.out.println("You have no cards. Unable to trade in.");
			command = new PlayCardsCommand(this.getId(), lastAckid++);
		}
		if(gameState.isCommandValid(command)) {
			notifyCommand(command);
			if(command.getCards() != null){
				for(Card[] cardSet : command.getCards()){
					for(Card card : cardSet){
						this.playCard(card);
					}
				}
			}
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getPlayCardsCommand();
		}
	}

	/**
	 * Creates a new RollNumber command
	 * @return the new RollNumberCommand
	 */
	public Command getRollNumberCommand()
	{
		Die die = this.getDie();
		String number = die.byteToHex(this.getLastRollNumber());
		
		RollNumberCommand command= new RollNumberCommand(this.getId(), number);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates a roll hash command
	 * @return the new RollHashCommand
	 */
	public Command getRollHashCommand()
	{
		Die die = this.getDie();
		byte[] num = die.generateNumber();
		this.setLastRollNumber(num);
		byte[] numHash = die.hashByteArr(num);
		String hash = die.byteToHex(numHash);
		
		RollHashCommand command = new RollHashCommand(this.getId(), hash);
		notifyCommand(command);
		return command;
	}
	
	/**
	 * Creates a ping command
	 * @return the new ping command
	 */
	public Command getPingCommand() 
	{
		PingCommand command = new PingCommand(this.getId(), gameState.getNumberOfPlayers());
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates a ready command
	 * @return the new ReadyCommand
	 */
	public Command getReadyCommand() 
	{
		ReadyCommand command = new ReadyCommand(this.getId(), lastAckid++);
		notifyCommand(command);
		return command;
	}

	/**
	 * Creates an initialise game command
	 * @return the new InitialiseGameCommand
	 */
	public Command getInitialiseGameCommand()
	{
		int version = 1;
		String[] supportedFeatures = {};
		InitialiseGameCommand command = new InitialiseGameCommand(version, supportedFeatures);
		notifyCommand(command);
		return command;
	}

	/**
	 * Calls appropriate notify method for each command, which updates the players game state and informs the user
	 * via the command line of commands that have been actioned
	 * @param command the command to notify
	 */
	@Override
	public void notifyCommand(Command command)
	{
		switch(command.getType()) {
		case ASSIGN_ARMY:
			notifyCommand((AssignArmyCommand) command);
			break;
		case ATTACK:
			notifyCommand((AttackCommand) command);
			break;
		case FORTIFY:
			notifyCommand((FortifyCommand) command);
			break;
		case DEPLOY:
			notifyCommand((DeployCommand) command);
			break;
		case DEFEND:
			notifyCommand((DefendCommand) command);
			break;
		case ATTACK_CAPTURE:
			notifyCommand((AttackCaptureCommand) command);
			break;
		case INITIALISE_GAME:
//			notifyCommand((InitialiseGameCommand) command);
			break;
		case PLAYERS_JOINED:
			notifyCommand((PlayersJoinedCommand) command);
			break;
		case READY:
			notifyCommand((ReadyCommand) command);
			break;
		case TIMEOUT:
			notifyCommand((TimeoutCommand) command);
			break;
		case LEAVE_GAME:
			notifyCommand((LeaveGameCommand) command);
			break;
		case PLAY_CARDS:
			notifyCommand((PlayCardsCommand) command);
			break;
		case ROLL_NUMBER:
			notifyCommand((RollNumberCommand) command);
			break;
		case ROLL_HASH:
			notifyCommand((RollHashCommand) command);
			break;
		default:
			notifyCommand((LeaveGameCommand) command);
			break;
		}
	}

	/**
	 * Update the players game state for an ArmyCommand and inform the user of what has happened via the command line
	 * @param command
	 */
	public void notifyCommand(AssignArmyCommand command)
	{
		String name = gameState.getMap().findTerritoryById(command.getTerritoryId()).getName();
		if(gameState.getMap().findTerritoryById(command.getTerritoryId()).isClaimed()){
			System.out.println("Player " + command.getPlayerId() + " reinforced territory: " + name);
		} else {
			System.out.println("Player " + command.getPlayerId() + " claimed territory: " + name);
		}
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid AssignArmyCommand.");
		}
	}

	/**
	 * Update the players game state for an AttackCommand and inform the user of what has happened via the command line
	 * @param command
	 */
	public void notifyCommand(AttackCommand command)
	{
		this.attackSourceId = command.getSource();
		this.attackDestId = command.getDest();
		String destName = gameState.getMap().findTerritoryById(command.getDest()).getName();
		String srcName = gameState.getMap().findTerritoryById(command.getSource()).getName();
		System.out.println("Player " + command.getPlayerId() + " is attacking " + destName + " from " + srcName + " with " + command.getArmies() + " armies.");
		
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid AttackCommand.");
		}	
	}

	/**
	 * Update the players game state for an FortifyCommand and inform the user of what has happened via the command line
	 * @param command
	 */
	public void notifyCommand(FortifyCommand command)
	{
		if(command.getFortifyDetails() == null || command.getFortifyDetails()[2] == 0){
			System.out.println("Player: " + command.getPlayerId() + " did not fortify");
		} else {
			String srcName = gameState.getMap().findTerritoryById(command.getFortifyDetails()[0]).getName();
			String destName = gameState.getMap().findTerritoryById(command.getFortifyDetails()[1]).getName();
			int armies = command.getFortifyDetails()[2];
			System.out.println("Player " + command.getPlayerId() + " is fortifying " + destName + " from " + srcName + " with " + armies + " armies");
		}
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid FortifyCommand.");
		}
		if(gameState.getAttackSuccessful()){
			Card drawnCard = gameState.drawCard(command.getPlayerId());
			if(drawnCard!= null && command.getPlayerId() == this.getId()){
				this.addCard(drawnCard);
			}
		}
	}

	/**
	 * Update the players game state for a Deploy and inform the user of what has happened via the command line
	 * @param command
	 */
	public void notifyCommand(DeployCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " has actioned the following deployments:");
		for (Deployment deployment : command.getDeployments()){
			String name = gameState.getMap().findTerritoryById(deployment.getTerritoryId()).getName();
			System.out.println(deployment.getArmies() + " armies to " + name);
		}
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid DeployCommand.");
		}	
	}

	/**
	 * Update the players game state for a DefendCommand and inform the user of what has happened via the command line
	 * @param command
	 */
	public void notifyCommand(DefendCommand command)
	{
		String name = gameState.getMap().findTerritoryById(attackDestId).getName();
		System.out.println("Player " + command.getPlayerId() + " is defending " + name + " with " + command.getArmies() + " armies");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid DefendCommand.");
		}	
	}

	/**
	 * Update the players game state for an AttackCaptureCommand and inform the user of what has happened via
	 * the command line
	 * @param command
	 */
	public void notifyCommand(AttackCaptureCommand command)
	{
		String name = gameState.getMap().findTerritoryById(command.getCaptureDetails()[1]).getName();
		System.out.println("Player " + command.getPlayerId() + " has captured " + name + " with " + command.getCaptureDetails()[2] + " armies,");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid AttackCaptureCommand.");
		}	
	}

	/**
	 * Update the players game state for a TimeoutCommand and inform the user of what has happened via the command line
	 * @param command
	 */
	public void notifyCommand(TimeoutCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " timed out.");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid TimeOutCommand.");
		}		
	}

	/**
	 * Update the players game state for a LeaveGameCommand and inform the user of what has happened
	 * via the command line
	 * @param command
	 */
	public void notifyCommand(LeaveGameCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " left the game.");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid LeaveGameCommand.");
		}		
	}

	/**
	 * Update the players game state for a PlayCards and inform the user of what has happened via the command line
	 * @param command
	 */
	public void notifyCommand(PlayCardsCommand command)
	{
		gameState.setDeployableArmies();

		if(command.getCards() == null){
			System.out.println("Player: " + command.getPlayerId() + " traded in 0 cards");
			return;
		}
		System.out.println("Player " + command.getPlayerId() + " played the following cards:");
		int set = 1;
		for(Card[] cardSet : command.getCards()){
			System.out.println("Set " + set + ": " + cardSet[0].getCardType() + ", " + cardSet[1].getCardType() + " and " + cardSet[2].getCardType());
			set++;
		}
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid PlayCardsCommand.");
		}	
	}

	/**
	 * Update the players game state for a RollNumberCommand and inform the user of what has happened
	 * via the command line
	 * @param command
	 */
	public void notifyCommand(RollNumberCommand command)
	{
//		System.out.println("Player " + command.getPlayerId() + " sent rollNumberHex");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid RollNumberCommand.");
		}	
	}

	/**
	 * Update the players game state for a RollHashCommand and inform the user of what has happened
	 * via the command line
	 * @param command
	 */
	public void notifyCommand(RollHashCommand command) 
	{
//		System.out.println("Player " + command.getPlayerId() + " sent roll Hash");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid RollHashCommand.");
		}	
	}


	public void setDeckOrder(int[] deckOrder)
	{
		gameState.setDeckOrder(deckOrder);
	}

	public boolean canPlayerAttack()
	{
		Territory[] territories = gameState.getTerritoriesForPlayer(this.getId());

		for(Territory territory : territories){
			for(Territory linkedTerritory : territory.getLinkedTerritories()){
				if((linkedTerritory.getOwner() != this.getId()) && (territory.getArmies() > 1)){
					return true;
				}
			}
		}
		return false;
	}
}
