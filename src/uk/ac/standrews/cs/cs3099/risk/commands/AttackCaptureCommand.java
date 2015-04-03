package uk.ac.standrews.cs.cs3099.risk.commands;


public class AttackCaptureCommand extends Command {
	public int[] captureDetails = new int[3];

	public AttackCaptureCommand(int playerId, int ackId, int[] captureDetails) 
	{
		super(playerId, ackId);
		this.captureDetails = captureDetails;
	}

	public int[] getCaptureDetails()
	{
		return captureDetails;
	}
	
	@Override
	public CommandType getType() 
	{
		return CommandType.ATTACK_CAPTURE;
	}

	@Override
	public String toJSON()
	{
		return null;
	}

}
