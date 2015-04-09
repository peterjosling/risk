package uk.ac.standrews.cs.cs3099.risk.commands;


public class AttackCaptureCommand extends Command {

	private String command = "attack_capture";
	public int[] payload = new int[3];

	public AttackCaptureCommand(int playerId, int ackId, int[] captureDetails) 
	{
		super(playerId, ackId);
		this.payload = captureDetails;
	}

	public int[] getCaptureDetails()
	{
		return payload;
	}
	
	@Override
	public CommandType getType() 
	{
		return CommandType.ATTACK_CAPTURE;
	}
}
