package uk.ac.standrews.cs.cs3099.risk.commands;

public class AcknowledgementCommand extends Command {
	private String command = "acknowledgement";
	private int payload;

	public AcknowledgementCommand(int playerId, int ackId)
	{
		super(playerId);
		payload = ackId;
	}

	public int getAckId()
	{
		return payload;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.ACKNOWLEDGEMENT;
	}
}
