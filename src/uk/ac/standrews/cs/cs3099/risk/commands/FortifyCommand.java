package uk.ac.standrews.cs.cs3099.risk.commands;

public class FortifyCommand extends Command {
	// Source, Destination, Armies
	private int[] fortifyDetails = new int[3];

	public FortifyCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public FortifyCommand(int playerId, int ackId, int[] fortifyDetails)
	{
		this(playerId, ackId);
		this.fortifyDetails = fortifyDetails;
	}

	/**
	 * @return Integer array containing the details for fortification.
	 */
	public int[] getFortifyDetails()
	{
		return fortifyDetails;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.FORTIFY;
	}

	@Override
	public String toJSON()
	{
		return null;
	}
}
