package uk.ac.standrews.cs.cs3099.risk.commands;

public class PingCommand extends Command {
	private int noOfPlayers;

	public PingCommand(int playerId) 
	{
		super(playerId);
	}
	
	public PingCommand(int playerId, int noOfPlayers)
	{
		super(playerId);
		this.noOfPlayers = noOfPlayers;
	}

	/**
	 * @return Integer count of the number players.
	 */
	public int getNoOfPlayers()
	{
		return noOfPlayers;
	}
	
	@Override
	public CommandType getType() 
	{
		return CommandType.PING;
	}

}
