package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.*;

import java.util.ArrayList;
import java.util.List;


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
	public Command getCommand(CommandType type)
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
				return getLeaveGameCommand();
		}
	}

	public Command getAssignArmyCommand(){
		System.out.println("Choose Territory to Assign Army. Enter Territory ID:");
		int territoryID = EasyIn.getInt();
		return new AssignArmyCommand(this.getId(), lastAckid++, territoryID);
	}

	public Command getAttackCommand(){
		System.out.println("Choose Territory to Attack From. Enter Territory ID:");
		int sourceID = EasyIn.getInt();
		System.out.println("Choose Territory to Attack. Enter Territory ID:");
		int destinationID = EasyIn.getInt();
		System.out.println("Enter number of armies to attack with:");
		int armies = EasyIn.getInt();
		return new AttackCommand(this.getId(), lastAckid++, sourceID, destinationID, armies);
	}

	public Command getFortifyCommand(){
		System.out.println("Choose Territory to Fortify from. Enter Territory ID:");
		int sourceID = EasyIn.getInt();
		System.out.println("Choose Territory to Fortify. Enter Territory ID:");
		int destinationID = EasyIn.getInt();
		System.out.println("Enter number of armies to fortify with:");
		int armies = EasyIn.getInt();
		int[] details = {sourceID, destinationID, armies};
		return new FortifyCommand(this.getId(), lastAckid++, details);
	}

	public Command getDeployCommand(){
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
		return new DeployCommand(this.getId(), lastAckid++, deployments);
	}

	public Command getDrawCardCommand(){
		return new DrawCardCommand(this.getId(), lastAckid++);
	}

	public Command getDefendCommand(){
		int territoryID = EasyIn.getInt(); //Where does this come from????
		System.out.println("Enter number of armies to defend with:");
		int armies = EasyIn.getInt();
		return new DefendCommand(this.getId(), lastAckid++, territoryID, armies);
	}

	public Command getJoinGameCommand(){
		float[] supportedVersions = {1};
		String[] supportedFeatures = {};
		return new JoinGameCommand(supportedVersions, supportedFeatures);
	}

	public Command getAcceptJoinGameCommand(){
		int ackTimeout = 4; //Check these values
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
		int timedOutPlayerId = EasyIn.getInt();
		return new TimeoutCommand(this.getId(), lastAckid++, timedOutPlayerId);
	}

	public Command getAttackCaptureCommand(){
		int sourceID = EasyIn.getInt();
		int destinationID = EasyIn.getInt();
		int armies = EasyIn.getInt();
		int[] captureDetails = {sourceID,destinationID,armies};
		return new AttackCaptureCommand(this.getId(), lastAckid++, captureDetails);
	}

	public Command getLeaveGameCommand(){
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

	public Command getPlayCardsCommand(){
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
		return new PlayCardsCommand(this.getId(), lastAckid++, cards);
	}

	public Command getRollNumberCommand(){
		String hash = "";
		return new RollNumberCommand(this.getId(), lastAckid++, hash);
	}

	public Command getRollCommand(){
		int faces = 6;
		System.out.println("Enter number of dice to be rolled:");
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
		//calls play move in gamestate
		//notifies all player of that command
	}
}
