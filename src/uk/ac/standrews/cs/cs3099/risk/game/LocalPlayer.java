package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;

import java.util.ArrayList;
import java.util.List;


public class LocalPlayer extends Player {
	private GameState gameState;
	private int attackSourceId;
	private int attackDestId;
	
	public LocalPlayer(int id)
	{
		super(id);
	}
	
	public LocalPlayer(int id, String name)
	{
		super(id, name);
	}

	public void initialiseGameState(ArrayList<Integer> players)
	{
		gameState = new GameState(players);
	}
	
	@Override
	public Command getCommand(CommandType type) {
		switch (type) {
			case ASSIGN_ARMY:
				return getAssignArmyCommand();
			case ATTACK:
				return getAttackCommand();
			case FORTIFY:
				return getFortifyCommand();
			case DEPLOY:
				return getDeployCommand();
			case DRAW_CARD:
				return getDrawCardCommand();
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

	public Command getAssignArmyCommand()
	{
		System.out.println("Choose Territory to Assign Army. Enter Territory ID:");
		int territoryID = EasyIn.getInt();
		AssignArmyCommand command = new AssignArmyCommand(this.getId(), lastAckid++, territoryID);
		if(gameState.isCommandValid(command)){
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getAssignArmyCommand();
		}
	}

	public Command getAttackCommand()
	{
		System.out.println("Choose Territory to Attack From. Enter Territory ID:");
		int sourceID = EasyIn.getInt();
		System.out.println("Choose Territory to Attack. Enter Territory ID:");
		int destinationID = EasyIn.getInt();
		System.out.println("Enter number of armies to attack with:");
		int armies = EasyIn.getInt();
		AttackCommand command = new AttackCommand(this.getId(), lastAckid++, sourceID, destinationID, armies);
		if(gameState.isCommandValid(command)) {
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getAttackCommand();	
		}
	}

	public Command getFortifyCommand()
	{
		System.out.println("Choose Territory to Fortify from. Enter Territory ID:");
		int sourceID = EasyIn.getInt();
		System.out.println("Choose Territory to Fortify. Enter Territory ID:");
		int destinationID = EasyIn.getInt();
		System.out.println("Enter number of armies to fortify with:");
		int armies = EasyIn.getInt();
		int[] details = {sourceID, destinationID, armies};
		FortifyCommand command = new FortifyCommand(this.getId(), lastAckid++, details);
		if(gameState.isCommandValid(command)) {
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getFortifyCommand();	
		}
	}

	public Command getDeployCommand()
	{
		System.out.println("Enter number of deployments:");
		int numberOfDeployments = EasyIn.getInt();
		int territoryID;
		int armies;
		DeployCommand.Deployment[] deployments = new DeployCommand.Deployment[numberOfDeployments];
		for(int i=0; i<numberOfDeployments; i++){
			System.out.println("Choose Territory To Deploy to. Enter Territory ID:");
			territoryID = EasyIn.getInt();
			System.out.println("Enter number of armies to deploy here:");
			armies = EasyIn.getInt();
			deployments[i] = new DeployCommand.Deployment(territoryID, armies);
		}
		DeployCommand command = new DeployCommand(this.getId(), lastAckid++, deployments);
		if(gameState.isCommandValid(command)) {
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getDeployCommand();	
		}
	}

	public Command getDrawCardCommand()
	{
		DrawCardCommand command = new DrawCardCommand(this.getId(), lastAckid++);
		if(gameState.isCommandValid(command)) {
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getDrawCardCommand();	
		}	
	}

	public Command getDefendCommand()
	{
		// Validate...
		System.out.println("Enter number of armies to defend with:");
		int armies = EasyIn.getInt();
		DefendCommand command = new DefendCommand(this.getId(), lastAckid++, armies);
		if(gameState.isCommandValid(command)) {
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getDefendCommand();	
		}
	}

	public Command getJoinGameCommand()
	{
		float[] supportedVersions = {1};
		String[] supportedFeatures = {};
		return new JoinGameCommand(supportedVersions, supportedFeatures);
	}

	public Command getAcceptJoinGameCommand()
	{
		int ackTimeout = 4; //Check these values
		int moveTimeout = 30;
		return new AcceptJoinGameCommand(this.getId(), ackTimeout, moveTimeout);
	}

	public Command getRejectJoinGameCommand()
	{
		String message = "Game in progress";
		return new RejectJoinGameCommand(message);
	}

	public Command getAcknowledgementCommand(){
		return new AcknowledgementCommand(this.getId(), lastAckid++);
	}

	public Command getTimeoutCommand()
	{
		int timedOutPlayerId = EasyIn.getInt();
		return new TimeoutCommand(this.getId(), lastAckid++, timedOutPlayerId);
	}

	public Command getAttackCaptureCommand()
	{
		int armies = EasyIn.getInt();
		int[] captureDetails = {attackSourceId,attackDestId,armies};
		AttackCaptureCommand command = new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
		if(gameState.isCommandValid(command)) {
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getAttackCaptureCommand();	
		}		
	}

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
		return new LeaveGameCommand(this.getId(), lastAckid++, response, receiveUpdates);
	}

	public Command getPlayCardsCommand()
	{
		System.out.println("Select number of card sets to trade in:");
		int numberOfTradeIns = EasyIn.getInt();
		List<Card> playersCards = getCards();
		System.out.println("Your Cards:");
		for(Card card:playersCards){
			System.out.println("Card ID:"+ card.getId() + "Territory ID:" +
					card.getTerritoryId() + "Card Type:" + card.getCardType());
		}
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
		PlayCardsCommand command = new PlayCardsCommand(this.getId(), lastAckid++, cards);
		if(gameState.isCommandValid(command)) {
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getPlayCardsCommand();	
		}		
	}

	public Command getRollNumberCommand()
	{
		String hash = "";
		return new RollNumberCommand(this.getId(), lastAckid++, hash);
	}

	public Command getRollHashCommand(){
		String hash = "";
		return new RollHashCommand(this.getId(), lastAckid++, hash);
	}

	public Command getPingCommand() {
		return new PingCommand(this.getId(), gameState.getNumberOfPlayers());
	}

	public Command getReadyCommand() {
		return new ReadyCommand(this.getId(), lastAckid++);
	}

	public Command getInitialiseGameCommand(){
		int version = 1;
		String[] supportedFeatures = {};
		return new InitialiseGameCommand(version, supportedFeatures);
	}

	@Override
	public void notifyCommand(Command command)
	{
		switch(command.getType()) {
		case ASSIGN_ARMY:
			notifyCommand((AssignArmyCommand) command);
		case ATTACK:
			notifyCommand((AttackCommand) command);
		case FORTIFY:
			notifyCommand((FortifyCommand) command);
		case DEPLOY:
			notifyCommand((DeployCommand) command);
		case DRAW_CARD:
			notifyCommand((DrawCardCommand) command);
		case DEFEND:
			notifyCommand((DefendCommand) command);
		case ATTACK_CAPTURE:
			notifyCommand((AttackCaptureCommand) command);
		case INITIALISE_GAME:
			notifyCommand((InitialiseGameCommand) command);
		case PLAYERS_JOINED:
			notifyCommand((PlayersJoinedCommand) command);
		case READY:
			notifyCommand((ReadyCommand) command);
		case TIMEOUT:
			notifyCommand((TimeoutCommand) command);
		case LEAVE_GAME:
			notifyCommand((LeaveGameCommand) command);
		case PLAY_CARDS:
			notifyCommand((PlayCardsCommand) command);
		case ROLL_NUMBER:
			notifyCommand((RollNumberCommand) command);
		case ROLL_HASH:
			notifyCommand((RollHashCommand) command);
		default:
			notifyCommand((LeaveGameCommand) command);
		}
	}
		
	public void notifyCommand(AssignArmyCommand command)
	{
		String name = gameState.getMap().findTerritoryById(command.getTerritoryId()).getName();
		System.out.println("Player " + command.getPlayerId() + " claimed territory: " + name);
		gameState.playCommand(command);
	}
	
	public void notifyCommand(AttackCommand command)
	{
		this.attackSourceId = command.getSource();
		this.attackDestId = command.getDest();
		String destName = gameState.getMap().findTerritoryById(command.getDest()).getName();
		String srcName = gameState.getMap().findTerritoryById(command.getSource()).getName();
		System.out.println("Player " + command.getPlayerId() + " is attacking " + destName + " from " + srcName + " with " + command.getArmies() + " armies.");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(FortifyCommand command)
	{
		String srcName = gameState.getMap().findTerritoryById(command.getFortifyDetails()[0]).getName();
		String destName = gameState.getMap().findTerritoryById(command.getFortifyDetails()[1]).getName();
		int armies = command.getFortifyDetails()[2];
		System.out.println("Player " + command.getPlayerId() + " is fortifying " + destName + " from " + srcName + " with " + armies + " armies");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(DeployCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " has actioned the following deployments:");
		for (Deployment deployment : command.getDeployments()){
			String name = gameState.getMap().findTerritoryById(deployment.getTerritoryId()).getName();
			System.out.println(deployment.getArmies() + " armies to " + name);
		}
		gameState.playCommand(command);
	}
	
	public void notifyCommand(DrawCardCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " has drawn a card.");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(DefendCommand command)
	{
		String name = gameState.getMap().findTerritoryById(attackDestId).getName();
		System.out.println("Player " + command.getPlayerId() + " is defending " + name + " with " + command.getArmies() + " armies");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(AttackCaptureCommand command)
	{
		String name = gameState.getMap().findTerritoryById(command.getCaptureDetails()[1]).getName();
		System.out.println("Player " + command.getPlayerId() + " has captured " + name + " with " + command.getCaptureDetails()[2] + " armies");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(TimeoutCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " timed out.");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(LeaveGameCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " left the game.");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(PlayCardsCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " played the following cards:");
		int set = 1;
		for(Card[] cardSet : command.getCards()){
			System.out.println("Set " + set + ": " + cardSet[0].getCardType() + ", " + cardSet[1].getCardType() + " and " + cardSet[2].getCardType());
			set++;
		}
		gameState.playCommand(command);
	}
	
	public void notifyCommand(RollNumberCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " sent rollNumberHex");
		gameState.playCommand(command);
	}
	
	public void notifyCommand(RollHashCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " sent roll Hash");
		gameState.playCommand(command);
	}

}
