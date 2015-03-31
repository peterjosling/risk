package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.*;

public class LocalPlayer extends Player {
	public LocalPlayer(int id)
	{
		super(id);
	}

	public LocalPlayer(int id, String name)
	{
		super(id, name);
	}

	@Override
	public Command getMove(CommandType type)
	{
		Command command = null;
		switch(type) {
			case ASSIGN_ARMY:
				int territoryID = 0;
				command = new AssignArmyCommand(this.getId(), lastAckid++, territoryID);
			case ATTACK:
				int sourceID = 0;
				int destinationID = 0;
				int armies = 0;
				command = new AttackCommand(this.getId(), lastAckid++, sourceID, destinationID, armies);
			case FORTIFY:
				sourceID = 0;
				destinationID = 0;
				armies = 0;
				command = new FortifyCommand(this.getId(), lastAckid++, sourceID, destinationID, armies);
			case DEPLOY:
				int numberOfDeployments = 0;
				DeployCommand.Deployment[] deployments = new DeployCommand.Deployment[numberOfDeployments];
				for(int i=0; i<numberOfDeployments; i++){
					territoryID = 0;
					armies = 0;
					deployments[i] = new DeployCommand.Deployment(territoryID, armies);
				}
				command = new DeployCommand(this.getId(), lastAckid++, deployments);
			case DRAW_CARD:
				command = new DrawCardCommand(this.getId(), lastAckid++);
			case DEFEND:
				territoryID = 0;
				armies = 0;
				command = new DefendCommand(this.getId(), lastAckid++, territoryID, armies);
			case TIMEOUT:
				int timedOutPlayerId = 0;
				command = new TimeoutCommand(this.getId(), lastAckid++, timedOutPlayerId);
			case ATTACK_CAPTURE:
				sourceID = 0;
				destinationID = 0;
				armies = 0;
				int[] captureDetails = {sourceID,destinationID,armies};
				command = new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
			case LEAVE_GAME:
				int response = 0;
				boolean receiveUpdates = false;
				command = new LeaveGameCommand(this.getId(), lastAckid++, response, receiveUpdates);
			case PLAY_CARDS:
				int numberOfTradeIns = 0;
				Card[][] cards = new Card[numberOfTradeIns][3];
				for(int i =0; i<numberOfTradeIns; i++){
					for(int j=0; i<cards[i].length; j++) {
						cards[i][j] = null;
					}
				}
				command = new PlayCardsCommand(this.getId(), lastAckid++, cards);
			case ROLL_NUMBER:
				command = null;
			case ROLL:
				command = null;
			case ROLL_HASH:
				command = null;
		}
		return command;
	}

	@Override
	public void notifyMove(Command move)
	{

	}
}
