package uk.ac.standrews.cs.cs3099.risk.ai;

import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;
import uk.ac.standrews.cs.cs3099.risk.game.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;

public class AIPlayer extends Player {
	private GameState gameState;

	private int attackSourceId;
	private int attackDestId;

	@Override
	public PlayerType getType()
	{
		return PlayerType.AI;
	}
	
	public AIPlayer(int id, String name)
	{
		super(id, name);
	}
	
	public AIPlayer(int id)
	{
		super(id);
	}

	public void initialiseGameState(ArrayList<Integer> playerInts)
	{
		gameState = new GameState(playerInts);
		gameState.loadDefaultMap();
	}
	
	public GameState getGameState()
	{
		return gameState;
	}
	
	@Override
	public boolean isNeutral() 
	{
		return isNeutral;
	}

	@Override
	public void setNeutral(boolean neutral)
	{
		isNeutral = neutral;
	}

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
	
	public Command getJoinGameCommand()
	{
		float[] supportedVersions = {1};
		String[] supportedFeatures = {};
		JoinGameCommand command = new JoinGameCommand(supportedVersions, supportedFeatures);
		notifyCommand(command);
		return command;
	}
	
	public Command getAcceptJoinGameCommand()
	{
		int ackTimeout = 4; //Check these values
		int moveTimeout = 30;
		AcceptJoinGameCommand command = new AcceptJoinGameCommand(this.getId(), ackTimeout, moveTimeout);
		notifyCommand(command);
		return command;
	}

	public Command getRejectJoinGameCommand()
	{
		String message = "Game in progress";
		RejectJoinGameCommand command = new RejectJoinGameCommand(message);
		notifyCommand(command);
		return command;
	}

	public Command getAcknowledgementCommand()
	{
		AcknowledgementCommand command = new AcknowledgementCommand(this.getId(), lastAckid++);
		notifyCommand(command);
		return command;
	}

	public Command getPingCommand() 
	{
		PingCommand command = new PingCommand(this.getId(), gameState.getNumberOfPlayers());
		notifyCommand(command);
		return command;
	}

	public Command getReadyCommand() 
	{
		ReadyCommand command = new ReadyCommand(this.getId(), lastAckid++);
		notifyCommand(command);
		return command;
	}

	public Command getInitialiseGameCommand()
	{
		int version = 1;
		String[] supportedFeatures = {};
		InitialiseGameCommand command = new InitialiseGameCommand(version, supportedFeatures);
		notifyCommand(command);
		return command;
	}

	public DeployCommand getDeployCommand() 
	{
		int deployableArmies = gameState.getDeployableArmies(this.getId());
		Deployment[] deployments = new Deployment[deployableArmies];

		Territory[] playerTerritories = gameState.getTerritoriesForPlayer(this.getId());
		for(int i = 0; i < deployableArmies; i ++){
			Random rnd = new Random();
			int nextRandom = rnd.nextInt(playerTerritories.length);
			Territory deployTerritory = playerTerritories[nextRandom];
			deployments[i] = new Deployment(deployTerritory.getId(), 1);
		}
		
		DeployCommand command = new DeployCommand(getId(), ++lastAckid, deployments);
		
		if(gameState.isCommandValid(command)){
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Player: " + this.getId() + " created an invalid Deploy Command");
		}
		return null;
	}
	
	public AssignArmyCommand getAssignArmyCommand()
	{
		Territory[] freeTerritories = gameState.getUnclaimedTerritories();
		Territory territory;

		if (freeTerritories.length > 0) {
			// Pick the first free territory to claim.
			territory = freeTerritories[0];
		} else {
			Territory[] territories = gameState.getTerritoriesForPlayer(this.getId());
			Random rnd = new Random();
			int nextRandom = rnd.nextInt(territories.length);
			territory = territories[nextRandom];
		}

		AssignArmyCommand command =  new AssignArmyCommand(getId(), ++lastAckid, territory.getId());
		if(gameState.isCommandValid(command)){
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Player: " + this.getId() + " created an invalid Assign Army Command");
		}
		return null;
	}

	public Command getRollNumberCommand()
	{
		Die die = this.getDie();
		String number = die.byteToHex(this.getLastRollNumber());
		
		RollNumberCommand command= new RollNumberCommand(this.getId(), number);
		notifyCommand(command);
		return command;
	}

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

	public Command getPlayCardsCommand() 
	{
		PlayCardsCommand command = null;
		if(getCards().size() < 3) command = new PlayCardsCommand(this.getId(), lastAckid++);
		
		ArrayList<ArrayList<Card>> nonWildCards = new ArrayList<ArrayList<Card>>();
		
		ArrayList<Card> artillery = new ArrayList<Card>();
		ArrayList<Card> infantry = new ArrayList<Card>();
		ArrayList<Card> cavalry = new ArrayList<Card>();
		ArrayList<Card> wild = new ArrayList<Card>();

		Card[][] cards = new Card[1][3];

		List<Card> playersCards = getCards();

		for(Card card:playersCards){
			if(card.getCardType() == Card.CardType.ARTILLERY) artillery.add(card);
			if(card.getCardType() == Card.CardType.INFANTRY) infantry.add(card);
			if(card.getCardType() == Card.CardType.CAVALRY) cavalry.add(card);
			if(card.getCardType() == Card.CardType.WILD) wild.add(card);
		}
		
		nonWildCards.add(artillery);
		nonWildCards.add(infantry);
		nonWildCards.add(cavalry);
		
		// 3 CARDS OF SAME TYPE
		for(ArrayList<Card> currentType : nonWildCards){
			if(currentType.size() >= 3){
				for(int i = 0; i < 3; i ++){
					cards[0][i] = currentType.get(i);
				}
				command = new PlayCardsCommand(this.getId(), lastAckid++, cards);
			}
		}

		// 3 CARDS OF DIFFERENT TYPE
		if(command == null){
			if(artillery.size() > 0 && infantry.size() > 0 && cavalry.size() > 0){
				for(int i = 0; i < 3; i++){
					cards[0][i] = nonWildCards.get(i).get(0);
				}
				command = new PlayCardsCommand(this.getId(), lastAckid++, cards);
			}
		}
		
		int total = artillery.size() + infantry.size() + cavalry.size();
		
		// 1 WILD && 2 RANDOM
		if(command == null){
			if((wild.size() > 0) && (total > 1)){
				int count = 1;
				cards[0][0] = wild.get(0);
				for(ArrayList<Card> currentType : nonWildCards){
					for(Card currentCard : currentType){
						if(count >= 3) break;
						cards[0][count] = currentCard;
						count ++;
						if(count == 3){
							command = new PlayCardsCommand(this.getId(), lastAckid++, cards);
							break;
						}
					}
				}
			}
		}
		
		if(command == null){
			command = new PlayCardsCommand(this.getId(), lastAckid++);
		}
		if(gameState.isCommandValid(command)){
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
			System.out.println("Player: " + this.getId() + " created an invalid Play Cards Command");
		}
		return null;
	}

	public Command getLeaveGameCommand()
	{
		LeaveGameCommand command = new LeaveGameCommand(this.getId(), lastAckid++, 100, "", false);
		notifyCommand(command);
		return command;
	}

	public Command getAttackCaptureCommand() 
	{	
		Territory source = gameState.getMap().findTerritoryById(attackSourceId);
		
		int armies = (source.getArmies() - 1) / 2;
		
		System.out.println("SOURCE ARMIES " + armies + ", " + source.getArmies() );
		if(armies < gameState.getRemainingArmies()){
			armies = gameState.getRemainingArmies();
		}

		int[] captureDetails = {attackSourceId,attackDestId,armies};
		AttackCaptureCommand command = new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
		if(gameState.isCommandValid(command)){
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Player: " + this.getId() + " created an invalid Attack Capture Command");
		}
			
		return null;
	}

	public Command getDefendCommand() 
	{
		Territory dest = gameState.getMap().findTerritoryById(attackDestId);
		int armies;
		if(dest.getArmies() >= 2) {
			armies = 2;
		} else {
			armies = 1;
		}
		DefendCommand command = new DefendCommand(this.getId(), lastAckid++, armies);
		if(gameState.isCommandValid(command)) {
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Invalid Defend Command, please try again.");
		}
		return null;
	}

	public Command getFortifyCommand() 
	{
		Territory[] territories = gameState.getTerritoriesForPlayer(this.getId());
		int[] details = new int[3];
		boolean fortifyFound = false;
		details[0] = 0;
		
		for(Territory territory : territories){
			
			// IS IT FROZEN
			boolean territoryFrozen = true;
			for(Territory linkedTerritory : territory.getLinkedTerritories()){
				if(linkedTerritory.getOwner() != this.getId()) territoryFrozen = false;
			}
			
			if(territoryFrozen && (territory.getArmies() -1 > details[2])){
				// IS A LINKED TERRITORY BESIDE ENEMY
				for(Territory linkedTerritory : territory.getLinkedTerritories()){
					for(Territory linkedLinkedTerritory : linkedTerritory.getLinkedTerritories()){
						if((linkedLinkedTerritory.getOwner() != this.getId())){
							details[0] = territory.getId();
							details[1] = linkedTerritory.getId();
							details[2] = territory.getArmies() - 1;
							fortifyFound = true;
						}
					}
				}	
			}
		}
		
		// TODO - LOOK FOR MAX AND MOVE TOWARD ENEMY, INSTEAD OF JUST MOVING TO EDGE.
		FortifyCommand command = null;
		if(fortifyFound){
			command = new FortifyCommand(this.getId(), lastAckid++, details);
		} else {
			command = new FortifyCommand(this.getId(), lastAckid++);
			System.out.println("Source: "+ command.getFortifyDetails()[0] + "Dest: " + command.getFortifyDetails()[1] +"armies: " + command.getFortifyDetails()[2]);
		}
		
		if(gameState.isCommandValid(command)) {
			notifyCommand(command);
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
		}
		return null;
	}

	public Command getAttackCommand() 
	{		
		if(canPlayerAttack()){
			Territory[] territories = gameState.getTerritoriesForPlayer(this.getId());
			int sourceId = 0;
			int destId = 0;
			int armies = 0;
			for(Territory territory : territories){
				if(territory.getArmies() > 1){
					Set<Territory> linkedTerritories = territory.getLinkedTerritories();
					for(Territory currentLinkedTerr : linkedTerritories){
						if(currentLinkedTerr.getOwner() != this.getId()){
							sourceId = territory.getId();
							destId = currentLinkedTerr.getId();
							if(territory.getArmies() > 3){
								armies = 3;
							} else {
								armies = territory.getArmies() - 1;
							}
						}
					}
				} else {
					continue;
				}
			}
			AttackCommand command = new AttackCommand(this.getId(), lastAckid++, sourceId, destId, armies);
			if(gameState.isCommandValid(command)){
				notifyCommand(command);
				return command;
			} else {
				System.out.println("Player: " + this.getId() + " created an invalid Attack Command");
			}	
		} else {
			System.out.println("Unable to make an attack.");
			return getFortifyCommand();
		}
		return null;
	}
	
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
		}
	}

	public void notifyCommand(AssignArmyCommand command)
	{
		String name = gameState.getMap().findTerritoryById(command.getTerritoryId()).getName();
		System.out.println("Player " + command.getPlayerId() + " claimed territory: " + name);
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid AssignArmyCommand.");
		}
	}
	
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
	
	public void notifyCommand(TimeoutCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " timed out.");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid TimeOutCommand.");
		}		
	}
	
	public void notifyCommand(LeaveGameCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " left the game.");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid LeaveGameCommand.");
		}		
	}
	
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
	
	public void notifyCommand(RollNumberCommand command)
	{
//		System.out.println("Player " + command.getPlayerId() + " sent rollNumberHex");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid RollNumberCommand.");
		}	
	}
	
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
