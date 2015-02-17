package uk.ac.standrews.cs.cs3099.risk.game;

public class DrawCardMove extends Move {
	
	public DrawCardMove(int playerId, int ackId)
	{
		super(playerId, ackId);
	}
	
	@Override
	public MoveType getType()
	{
		return MoveType.TRADE_IN_CARDS;
	}
}
