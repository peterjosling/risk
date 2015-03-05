package uk.ac.standrews.cs.cs3099.risk.game;

public class AttackCaptureCommand extends Command {
	private int[] captureDetails = new int[3];

	public AttackCaptureCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}
	
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
	public MoveType getType() 
	{
		return MoveType.ATTACK_CAPTURE;
	}

}
