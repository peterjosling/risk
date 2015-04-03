package uk.ac.standrews.cs.cs3099.risk.commands;

public abstract class Command {
	private int ackId;
	private int playerId;

	/**
	 * Creates a move instance which requires acknowledgement.
	 *
	 * @param playerId ID of the player making this move.
	 * @param ackId    Unique integer acknowledgement ID.
	 */
	public Command(int playerId, int ackId)
	{
		this.playerId = playerId;
		this.ackId = ackId;
	}

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
	 * Create a Command instance which has no player_id or ack_id fields.
	 */
	public Command()
	{
		this(-1, -1);
	}

	public int getPlayerId()
	{
		return playerId;
	}

	public int getAckId()
	{
		return ackId;
	}

	public abstract CommandType getType();

	public abstract String toJSON();
}
