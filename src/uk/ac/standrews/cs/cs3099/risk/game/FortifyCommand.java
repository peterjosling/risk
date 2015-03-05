package uk.ac.standrews.cs.cs3099.risk.game;

public class FortifyCommand extends Command {
	private int source;
	private int dest;
	private int armies;

	public FortifyCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public FortifyCommand(int playerId, int ackId, int source, int dest, int armies)
	{
		this(playerId, ackId);
		this.source = source;
		this.dest = dest;
		this.armies = armies;
	}

	/**
	 * @return Integer ID of the territory armies are being moved from.
	 */
	public int getSource()
	{
		return source;
	}

	/**
	 * @return Integer ID of the territory being attacked.
	 */
	public int getDest()
	{
		return dest;
	}

	/**
	 * @return Integer count of the number of armies attacking.
	 */
	public int getArmies()
	{
		return armies;
	}

	@Override
	public MoveType getType()
	{
		return MoveType.FORTIFY;
	}
}
