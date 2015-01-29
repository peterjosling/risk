package uk.ac.standrews.cs.cs3099.risk.game;

public abstract class Move {
	private int ackId;

	public Move(int ackId)
	{
		this.ackId = ackId;
	}

	public int getAckId()
	{
		return ackId;
	}

	public abstract MoveType getType();
}
