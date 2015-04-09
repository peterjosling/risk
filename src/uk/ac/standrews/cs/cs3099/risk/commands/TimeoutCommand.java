package uk.ac.standrews.cs.cs3099.risk.commands;


public class TimeoutCommand extends Command {
	private String command = "timeout";
	private int payload;

	public TimeoutCommand(int playerId, int ackId, int timeoutId) 
	{
		super(playerId, ackId);
		this.payload = timeoutId;
	}

	/**
	 * @return Integer ID of the player who has timed out.
	 */
	public int getTimeoutId()
	{
		return payload;
	}
	
	@Override
	public CommandType getType() 
	{
		return CommandType.TIMEOUT;
	}
}
