package uk.ac.standrews.cs.cs3099.risk.game;

public class AcceptJoinGameCommand extends Command {
	private int acknowledgementTimeout;
	private int moveTimeout;
	
	public AcceptJoinGameCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}
	
	public AcceptJoinGameCommand(int playerId, int ackId, int ackTimeout, int moveTimeout)
	{
		super(playerId, ackId);
		this.acknowledgementTimeout = ackTimeout;
		this.moveTimeout = moveTimeout;
	}
	
	public int getAcknowledgementTimeout() 
	{
		return acknowledgementTimeout;
	}

	public int getMoveTimeout() 
	{
		return moveTimeout;
	}

	@Override
	public MoveType getType() 
	{
		return MoveType.ACCEPT_JOIN_GAME;
	}

}
