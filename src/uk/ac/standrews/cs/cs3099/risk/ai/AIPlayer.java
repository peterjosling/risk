package uk.ac.standrews.cs.cs3099.risk.ai;

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
import uk.ac.standrews.cs.cs3099.risk.commands.LeaveGameCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.PlayCardsCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.PlayersJoinedCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.ReadyCommand;
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
	private int ack_id = 0;
	private int attackSourceId;
	private int attackDestId;

	public AIPlayer(int id, String name)
	{
		super(id, name);
	}

	public void initialiseGameState(ArrayList<Integer> players)
	{
		gameState = new GameState(players);
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
			case DRAW_CARD:
				return getDrawCardCommand();
			case DEFEND:
				return getDefendCommand();
			case JOIN_GAME:
//				return getJoinGameCommand();
			case ACCEPT_JOIN_GAME:
//				return getAcceptJoinGameCommand();
			case REJECT_JOIN_GAME:
//				return getRejectJoinGameCommand();
			case ACKNOWLEDGEMENT:
//				return getAcknowledgementCommand();
			case TIMEOUT:
//				return getTimeoutCommand();
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
//				return getPingCommand();
			case READY:
//				return getReadyCommand();
			case INITIALISE_GAME:
//				return getInitialiseGameCommand();
			default:
				return getLeaveGameCommand();
		}
	}

	private DeployCommand getDeployCommand() 
	{
		// Deploys all troops to first owned territory.
		Territory deployTerritory = gameState.getTerritoriesForPlayer(getId())[0];
		Deployment[] deployments = new Deployment[1];
		deployments[0] = new Deployment(deployTerritory.getId(), gameState.getDeployableArmies(getId()));
		
		return new DeployCommand(getId(), ++ack_id, deployments);
	}
	
	private AssignArmyCommand getAssignArmyCommand()
	{
		// Pick the first free territory to claim.
		Territory[] freeTerritories = gameState.getUnclaimedTerritories();
		Territory territory = freeTerritories[0];
		
		return new AssignArmyCommand(getId(), ++ack_id, territory.getId());
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

	private Command getPlayCardsCommand() 
	{
		return null;		
	}

	public Command getLeaveGameCommand()
	{
		return new LeaveGameCommand(this.getId(), lastAckid++, 100, false);
	}

	private Command getAttackCaptureCommand() 
	{	
		Territory source = gameState.getMap().findTerritoryById(attackSourceId);
		
		int armies = source.getArmies() - 1;
		int[] captureDetails = {attackSourceId,attackDestId,armies};
		
		AttackCaptureCommand command = new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
		return command;
	}

	private Command getDefendCommand() 
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

	private Command getFortifyCommand() 
	{
		FortifyCommand command = new FortifyCommand(this.getId(), lastAckid++);
		return command;
	}

	private Command getAttackCommand() 
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
		return command;
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
