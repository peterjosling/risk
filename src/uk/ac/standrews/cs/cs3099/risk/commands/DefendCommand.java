package uk.ac.standrews.cs.cs3099.risk.commands;

public class DefendCommand extends Command{
	private String command = "defend";
	private int payload;
	
	public DefendCommand(int playerId, int ackId, int armies)
	{
		super(playerId, ackId);
		payload = armies;
	}

	
	/**
	 * @return Integer count of the number of armies attacking.
	 */
	public int getArmies()
	{
		return payload;
	}
	
	@Override
	public CommandType getType()
	{
		return CommandType.DEFEND;
	}
}
