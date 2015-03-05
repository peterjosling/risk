package uk.ac.standrews.cs.cs3099.risk.game;

public abstract class Command {
	private int ackId;
	private int playerId;

	/**
	 * Creates a move instance with no acknowledgement ID.
	 *
	 * @param playerId ID of the player making this move.
	 */
	public Command(int playerId)
	{
		this(playerId, -1);
	}

	/**
	 * Creates a move instance which requires acknowledgement.
	 *
	 * @param playerId ID of the player making this move.
	 * @param ackId Unique integer acknowledgement ID.
	 */
	public Command(int playerId, int ackId)
	{
		this.playerId = playerId;
		this.ackId = ackId;
	}

	public int getPlayerId()
	{
		return playerId;
	}

	public int getAckId()
	{
		return ackId;
	}

	public abstract MoveType getType();
}
