package uk.ac.standrews.cs.cs3099.risk.commands;



public class AcknowledgementCommand extends Command {
	private int response;
	
	public AcknowledgementCommand(int playerId, int ackId, int response) 
	{
		super(playerId, ackId);
		this.response = response;
	}

	public int getResponse() 
	{
		return response;
	}
	
	@Override
	public CommandType getType() 
	{
		return CommandType.ACKNOWLEDGEMENT;
	}
}
