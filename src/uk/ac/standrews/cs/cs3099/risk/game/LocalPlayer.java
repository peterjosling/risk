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
	public Command getCommand(CommandType type) throws CommandNotFoundException
	{
		switch(type) {
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
			case ROLL:
				return getRollCommand();
			case ROLL_HASH:
				return getRollHashCommand();
			default:
				throw new CommandNotFoundException("command not found");
		}
	}

	public Command getAssignArmyCommand(){
		int territoryID = 0;
		return new AssignArmyCommand(this.getId(), lastAckid++, territoryID);
	}

	public Command getAttackCommand(){
		int sourceID = 0;
		int destinationID = 0;
		int armies = 0;
		return new AttackCommand(this.getId(), lastAckid++, sourceID, destinationID, armies);
	}

	public Command getFortifyCommand(){
		int sourceID = 0;
		int destinationID = 0;
		int armies = 0;
		int[] details = {sourceID, destinationID, armies};
		return new FortifyCommand(this.getId(), lastAckid++, details);
	}

	public Command getDeployCommand(){
		int numberOfDeployments = 0;
		int territoryID;
		int armies;
		DeployCommand.Deployment[] deployments = new DeployCommand.Deployment[numberOfDeployments];
		for(int i=0; i<numberOfDeployments; i++){
			territoryID = 0;
			armies = 0;
			deployments[i] = new DeployCommand.Deployment(territoryID, armies);
		}
		return new DeployCommand(this.getId(), lastAckid++, deployments);
	}

	public Command getDrawCardCommand(){
		return new DrawCardCommand(this.getId(), lastAckid++);
	}

	public Command getDefendCommand(){
		int territoryID = 0;
		int armies = 0;
		return new DefendCommand(this.getId(), lastAckid++, territoryID, armies);
	}

	public Command getJoinGameCommand(){
		float[] supportedVersions = {1};
		String[] supportedFeatures = {};
		return new JoinGameCommand(supportedVersions, supportedFeatures);
	}

	public Command getAcceptJoinGameCommand(){
		int ackTimeout = 2;
		int moveTimeout = 30;
		return new AcceptJoinGameCommand(this.getId(), ackTimeout, moveTimeout);
	}

	public Command getRejectJoinGameCommand(){
		String message = "Game in progress";
		return new RejectJoinGameCommand(message);
	}

	public Command getAcknowledgementCommand(){
		int commandId = lastAckid;
		return new AcknowledgementCommand(this.getId(), lastAckid++, commandId);
	}

	public Command getTimeoutCommand(){
		int timedOutPlayerId = 0;
		return new TimeoutCommand(this.getId(), lastAckid++, timedOutPlayerId);
	}

	public Command getAttackCaptureCommand(){
		int sourceID = 0;
		int destinationID = 0;
		int armies = 0;
		int[] captureDetails = {sourceID,destinationID,armies};
		return new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
	}

	public Command getLeaveGameCommand(){
		int response = 0;
		boolean receiveUpdates = false;
		return new LeaveGameCommand(this.getId(), lastAckid++, response, receiveUpdates);
	}

	public Command getPlayCardsCommand(){
		int numberOfTradeIns = 0;
		Card[][] cards = new Card[numberOfTradeIns][3];
		for(int i =0; i<numberOfTradeIns; i++){
			for(int j=0; i<cards[i].length; j++) {
				cards[i][j] = null;
			}
		}
		return new PlayCardsCommand(this.getId(), lastAckid++, cards);
	}

	public Command getRollNumberCommand(){
		String hash = "";
		return new RollNumberCommand(this.getId(), lastAckid++, hash);
	}

	public Command getRollCommand(){
		int faces = 0;
		int numberOfDice = 0;
		return new RollCommand(this.getId(), lastAckid++, faces, numberOfDice);
	}

	public Command getRollHashCommand(){
		String hash = "";
		return new RollHashCommand(this.getId(), lastAckid++, hash);
	}

	@Override
	public void notifyCommand(Command command)
	{

	}
}
