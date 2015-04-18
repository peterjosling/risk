package uk.ac.standrews.cs.cs3099.risk.ai;

import uk.ac.standrews.cs.cs3099.risk.commands.AcceptJoinGameCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AcknowledgementCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AssignArmyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCaptureCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.AttackCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DefendCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.DrawCardCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.FortifyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.InitialiseGameCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.JoinGameCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.LeaveGameCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.PingCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.PlayCardsCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.PlayersJoinedCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.ReadyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.RejectJoinGameCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.RollHashCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.RollNumberCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.TimeoutCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;
import uk.ac.standrews.cs.cs3099.risk.game.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class AIPlayer extends Player {
	private GameState gameState;

	private int attackSourceId;
	private int attackDestId;

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
	
	public GameState getGameState(){
		return gameState;
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

	public DeployCommand getDeployCommand() 
	{
		// Deploys all troops to first owned territory.
		Territory deployTerritory = gameState.getTerritoriesForPlayer(getId())[0];
		Deployment[] deployments = new Deployment[1];
		deployments[0] = new Deployment(deployTerritory.getId(), gameState.getDeployableArmies(getId()));
		DeployCommand command = new DeployCommand(getId(), ++lastAckid, deployments);
		if(gameState.isCommandValid(command)){
			return command;
		} else {
			System.out.println("Player: " + this.getId() + " created an invalid Deploy Command");
		}
		return null;
	}
	
	public AssignArmyCommand getAssignArmyCommand()
	{
		// Pick the first free territory to claim.
		Territory[] freeTerritories = gameState.getUnclaimedTerritories();
		Territory territory = freeTerritories[0];
		AssignArmyCommand command =  new AssignArmyCommand(getId(), ++lastAckid, territory.getId());
		if(gameState.isCommandValid(command)){
			return command;
		} else {
			System.out.println("Player: " + this.getId() + " created an invalid Assign Army Command");
		}
		return null;
	}

	public Command getRollNumberCommand()
	{
		String hash = "";
		return new RollNumberCommand(this.getId(), hash);
	}

	public Command getRollHashCommand()
	{
		String hash = "";
		return new RollHashCommand(this.getId(), hash);
	}

	public Command getPlayCardsCommand() 
	{
		if(getCards().size() < 3) return new PlayCardsCommand(this.getId(), lastAckid++);
		
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
				cards[0] =  (Card[]) (currentType.subList(0, 2)).toArray();
				return new PlayCardsCommand(this.getId(), lastAckid++, cards);
			}
		}

		// 3 CARDS OF DIFFERENT TYPE
		if(artillery.size() > 0 && infantry.size() > 0 && cavalry.size() > 0){
			for(int i = 0; i < 3; i++){
				cards[0][i] = nonWildCards.get(i).get(0);
			}
			return new PlayCardsCommand(this.getId(), lastAckid++, cards);
		}
		
		int total = artillery.size() + infantry.size() + cavalry.size();
		// 1 WILD && 2 RANDOM
		if((wild.size() > 0) && (total > 1)){
			int count = 1;
			cards[0][0] = wild.get(0);
			for(ArrayList<Card> currentType : nonWildCards){
				for(Card currentCard : currentType){
					cards[0][count] = currentCard;
					count ++;
					if(count == 3){
						return new PlayCardsCommand(this.getId(), lastAckid++, cards);
					}
				}
			}
		}
		return new PlayCardsCommand(this.getId(), lastAckid++);
	}

	public Command getLeaveGameCommand()
	{
		return new LeaveGameCommand(this.getId(), lastAckid++, 100, "", false);
	}

	public Command getAttackCaptureCommand() 
	{	
		Territory source = gameState.getMap().findTerritoryById(attackSourceId);
		
		int armies = source.getArmies() - 1;
		int[] captureDetails = {attackSourceId,attackDestId,armies};
		
		AttackCaptureCommand command = new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
		if(gameState.isCommandValid(command)){
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
			return command;
		} else {
			System.out.println("Invalid Command, please try again.");
			return getDefendCommand();	
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

	public Command getFortifyCommand() 
	{
		return new FortifyCommand(this.getId(), lastAckid++);
	}

	public Command getAttackCommand() 
	{
		Territory[] territories = gameState.getTerritoriesForPlayer(this.getId());
		int sourceId = 1;
		int destId = 1;
		int armies = 1;
		for(Territory territory : territories){
			if(territory.getArmies() > 1){
				Set<Territory> linkedTerritories = territory.getLinkedTerritories();
				for(Territory currentLinkedTerr : linkedTerritories){
					if(currentLinkedTerr.getOwner() != this.getId()){
						sourceId = territory.getId();
						destId = currentLinkedTerr.getId();
						armies = territory.getArmies() - 1;
					}
				}
			} else {
				continue;
			}
		}
		AttackCommand command = new AttackCommand(this.getId(), lastAckid++, sourceId, destId, armies);
		if(gameState.isCommandValid(command)){
			return command;
		} else {
			System.out.println("Player: " + this.getId() + " created an invalid Attack Command");
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
		case DRAW_CARD:
			notifyCommand((DrawCardCommand) command);
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
		default:
			notifyCommand((LeaveGameCommand) command);
		}
	}

	@Override
	public boolean isNeutral() {
		return isNeutral;
	}

	@Override
	public void makeNeutral() {
		isNeutral = true;
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
		String srcName = gameState.getMap().findTerritoryById(command.getFortifyDetails()[0]).getName();
		String destName = gameState.getMap().findTerritoryById(command.getFortifyDetails()[1]).getName();
		int armies = command.getFortifyDetails()[2];
		System.out.println("Player " + command.getPlayerId() + " is fortifying " + destName + " from " + srcName + " with " + armies + " armies");
		
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid FortifyCommand.");
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
	
	public void notifyCommand(DrawCardCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " has drawn a card.");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid DrawCardCommand.");
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
		System.out.println("Player " + command.getPlayerId() + " has captured " + name + " with " + command.getCaptureDetails()[2] + " armies");
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
		System.out.println("Player " + command.getPlayerId() + " sent rollNumberHex");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid RollNumberCommand.");
		}	
	}
	
	public void notifyCommand(RollHashCommand command)
	{
		System.out.println("Player " + command.getPlayerId() + " sent roll Hash");
		if(gameState.isCommandValid(command)){
			gameState.playCommand(command);
		} else {
			System.out.println("Invalid RollHashCommand.");
		}	
	}
}
