package uk.ac.standrews.cs.cs3099.risk.commands;

public class FortifyCommand extends Command {

	private String command = "fortify";
	// Source, Destination, Armies
	private int[] payload = new int[3];

	public FortifyCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public FortifyCommand(int playerId, int ackId, int[] fortifyDetails)
	{
		this(playerId, ackId);
		this.payload = fortifyDetails;
	}

	/**
	 * @return Integer array containing the details for fortification.
	 */
	public int[] getFortifyDetails()
	{
		return payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.FORTIFY;
	}
}
