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
				break;
			case ATTACK:
				int sourceID = 0;
				int destinationID = 0;
				int armies = 0;
				command = new AttackCommand(this.getId(), lastAckid++, sourceID, destinationID, armies);
				break;
			case FORTIFY:
				sourceID = 0;
				destinationID = 0;
				armies = 0;
				int[] details = {sourceID, destinationID, armies};
				command = new FortifyCommand(this.getId(), lastAckid++, details);
				break;
			case DEPLOY:
				int numberOfDeployments = 0;
				DeployCommand.Deployment[] deployments = new DeployCommand.Deployment[numberOfDeployments];
				for(int i=0; i<numberOfDeployments; i++){
					territoryID = 0;
					armies = 0;
					deployments[i] = new DeployCommand.Deployment(territoryID, armies);
				}
				command = new DeployCommand(this.getId(), lastAckid++, deployments);
				break;
			case DRAW_CARD:
				command = new DrawCardCommand(this.getId(), lastAckid++);
				break;
			case DEFEND:
				territoryID = 0;
				armies = 0;
				command = new DefendCommand(this.getId(), lastAckid++, territoryID, armies);
			case JOIN_GAME:
				float[] supportedVersions = {1};
				String[] supportedFeatures = {};
				command = new JoinGameCommand(this.getId(), lastAckid++,supportedVersions, supportedFeatures);
				break;
			case ACCEPT_JOIN_GAME:
				int ackTimeout = 2;
				int moveTimeout = 30;
				command = new AcceptJoinGameCommand(this.getId(), lastAckid++, ackTimeout, moveTimeout);
				break;
			case REJECT_JOIN_GAME:
				String message = "Game in progress";
				command = new RejectJoinGameCommand(this.getId(), lastAckid++, message);
				break;
			case ACKNOWLEDGEMENT:
				int commandId = lastAckid;
				command = new AcknowledgementCommand(this.getId(), lastAckid++, commandId);
				break;
			case TIMEOUT:
				int timedOutPlayerId = 0;
				command = new TimeoutCommand(this.getId(), lastAckid++, timedOutPlayerId);
				break;
			case ATTACK_CAPTURE:
				sourceID = 0;
				destinationID = 0;
				armies = 0;
				int[] captureDetails = {sourceID,destinationID,armies};
				command = new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
				break;
			case LEAVE_GAME:
				int response = 0;
				boolean receiveUpdates = false;
				command = new LeaveGameCommand(this.getId(), lastAckid++, response, receiveUpdates);
				break;
			case PLAY_CARDS:
				int numberOfTradeIns = 0;
				Card[][] cards = new Card[numberOfTradeIns][3];
				for(int i =0; i<numberOfTradeIns; i++){
					for(int j=0; i<cards[i].length; j++) {
						cards[i][j] = null;
					}
				}
				command = new PlayCardsCommand(this.getId(), lastAckid++, cards);
				break;
			case ROLL_NUMBER:
				String hash = "";
				command = new RollNumberCommand(this.getId(), lastAckid++, hash);
				break;
			case ROLL:
				int faces = 0;
				int numberOfDice = 0;
				command = new RollCommand(this.getId(), lastAckid++, faces, numberOfDice);
				break;
			case ROLL_HASH:
				hash = "";
				command = new RollHashCommand(this.getId(), lastAckid++, hash);
				break;
			default:
				System.out.println("command not found");
		}
		return command;
	}

	@Override
	public void notifyMove(Command move)
	{

	}
}
