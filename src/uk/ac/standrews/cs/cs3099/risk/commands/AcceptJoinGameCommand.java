package uk.ac.standrews.cs.cs3099.risk.commands;


public class AcceptJoinGameCommand extends Command {
	private int acknowledgementTimeout;
	private int moveTimeout;
	
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
	public CommandType getType() 
	{
		return CommandType.ACCEPT_JOIN_GAME;
	}

}
