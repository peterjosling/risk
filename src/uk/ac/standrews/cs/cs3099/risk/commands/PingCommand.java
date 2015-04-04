package uk.ac.standrews.cs.cs3099.risk.commands;

public class PingCommand extends Command {
	private String command = "ping";
	private int payload;

	public PingCommand(int playerId) 
	{
		super(playerId);
		this.payload = -1;
	}

	public PingCommand(int playerId, int noOfPlayers)
	{
		super(playerId);
		this.payload = noOfPlayers;
	}

	/**
	 * @return Integer count of the number players.
	 */
	public int getNoOfPlayers()
	{
		return payload;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.PING;
	}
}
