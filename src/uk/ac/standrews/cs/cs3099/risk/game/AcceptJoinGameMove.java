package uk.ac.standrews.cs.cs3099.risk.game;

public class AcceptJoinGameMove extends Move {
	private int acknowledgementTimeout;
	private int moveTimeout;
	
	public AcceptJoinGameMove(int playerId, int ackId) 
	{
		super(playerId, ackId);
	}
	
	public AcceptJoinGameMove(int playerId, int ackId, int ackTimeout, int moveTimeout)
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
	public MoveType getType() {
		// TODO Auto-generated method stub
		return null;
	}

}
