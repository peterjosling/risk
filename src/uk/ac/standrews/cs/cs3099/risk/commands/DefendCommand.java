package uk.ac.standrews.cs.cs3099.risk.commands;

public class DefendCommand extends Command{
	private int territory;
	private int armies;
	
	public DefendCommand(int playerId, int ackId, int territory, int armies)
	{
		super(playerId, ackId);
		this.territory = territory;
		this.armies = armies;
	}
	
	/**
	 * @return Integer ID of the territory armies are being moved from.
	 */
	public int getTerritory()
	{
		return territory;
	}
	
	/**
	 * @return Integer count of the number of armies attacking.
	 */
	public int getArmies()
	{
		return armies;
	}
	
	@Override
	public CommandType getType()
	{
		return CommandType.DEFEND;
	}
	
}
