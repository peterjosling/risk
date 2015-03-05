package uk.ac.standrews.cs.cs3099.risk.game;

public class AttackCaptureMove extends Move {
	private int[] captureDetails = new int[3];

	public AttackCaptureMove(int playerId, int ackId) 
	{
		super(playerId, ackId);
	}
	
	public AttackCaptureMove(int playerId, int ackId, int[] captureDetails) 
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
