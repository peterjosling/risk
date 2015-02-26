package uk.ac.standrews.cs.cs3099.risk.game;


public class AcknowledgementMove extends Move {
	private int response;

	public AcknowledgementMove(int playerId, int ackId) 
	{
		super(playerId, ackId);
	}
	
	public AcknowledgementMove(int playerId, int ackId, int response) 
	{
		super(playerId, ackId);
		this.response = response;
	}

	public int getResponse() 
	{
		return response;
	}
	
	@Override
	public MoveType getType() 
	{
		return MoveType.ACKNOWLEDGEMENT;
	}

}
