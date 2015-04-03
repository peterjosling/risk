package uk.ac.standrews.cs.cs3099.risk.commands;


public class AcceptJoinGameCommand extends Command {
	private int acknowledgementTimeout;
	private int commandTimeout;
	
	public AcceptJoinGameCommand(int playerId, int ackId, int ackTimeout, int commandTimeout)
	{
		super(playerId, ackId);
		this.acknowledgementTimeout = ackTimeout;
		this.commandTimeout = commandTimeout;
	}
	
	public int getAcknowledgementTimeout() 
	{
		return acknowledgementTimeout;
	}

	public int getCommandTimeout() 
	{
		return commandTimeout;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.ACCEPT_JOIN_GAME;
	}

}
