package uk.ac.standrews.cs.cs3099.risk.game;

public class RejectJoinGameCommand extends Command {
	private String errorMessage;

	public RejectJoinGameCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}
	
	public RejectJoinGameCommand(int playerId, int ackId, String errorMessage)
	{
		super(playerId, ackId);
		this.errorMessage = errorMessage;
	}
	
	public String getErrorMessage()
	{
		return errorMessage;
	}

	@Override
	public MoveType getType() 
	{
		return MoveType.REJECT_JOIN_GAME;
	}

}
