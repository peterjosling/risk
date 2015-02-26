package uk.ac.standrews.cs.cs3099.risk.game;


public class TimeoutMove extends Move {
	private int timeoutId;

	public TimeoutMove(int playerId, int ackId) 
	{
		super(playerId, ackId);
	}

	public TimeoutMove(int playerId, int ackId, int timeoutId) 
	{
		super(playerId, ackId);
		this.timeoutId = timeoutId;
	}

	public int getTimeoutId()
	{
		return timeoutId;
	}
	
	@Override
	public MoveType getType() 
	{
		return MoveType.TIMEOUT;
	}

}
