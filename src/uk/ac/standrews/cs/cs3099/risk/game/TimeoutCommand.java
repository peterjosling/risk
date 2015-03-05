package uk.ac.standrews.cs.cs3099.risk.game;


public class TimeoutCommand extends Command {
	private int timeoutId;

	public TimeoutCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public TimeoutCommand(int playerId, int ackId, int timeoutId)
	{
		super(playerId, ackId);
		this.timeoutId = timeoutId;
	}

	public int getTimeoutId()
	{
		return timeoutId;
	}
	
	@Override
	public CommandType getType()
	{
		return CommandType.TIMEOUT;
	}

}
