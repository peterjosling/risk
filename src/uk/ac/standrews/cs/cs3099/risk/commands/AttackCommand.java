package uk.ac.standrews.cs.cs3099.risk.commands;


public class AttackCommand extends Command {
	private String command = "attack";
	private int[] payload = new int[3];

	public AttackCommand(int playerId, int ackId, int source, int dest, int armies)
	{
		super(playerId, ackId);
		payload[0] = source;
		payload[1] = dest;
		payload[2] = armies;
	}

	/**
	 * @return Integer ID of the territory armies are being moved from.
	 */
	public int getSource()
	{
		return payload[0];
	}

	/**
	 * @return Integer ID of the territory being attacked.
	 */
	public int getDest()
	{
		return payload[1];
	}

	/**
	 * @return Integer count of the number of armies attacking.
	 */
	public int getArmies()
	{
		return payload[2];
	}

	@Override
	public CommandType getType()
	{
		return CommandType.ATTACK;
	}
}
