package uk.ac.standrews.cs.cs3099.risk.commands;


public class AssignArmyCommand extends Command {
	private String command = "assign_army";
	private int payload;

	public AssignArmyCommand(int playerId, int ack_id, int territoryId)
	{
		super(playerId, ack_id);
		payload = territoryId;
	}

	public int getTerritoryId()
	{
		return payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.ASSIGN_ARMY;
	}
}
