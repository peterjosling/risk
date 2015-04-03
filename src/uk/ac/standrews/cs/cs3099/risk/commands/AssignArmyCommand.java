package uk.ac.standrews.cs.cs3099.risk.commands;


public class AssignArmyCommand extends Command {
	private int territoryId;

	public AssignArmyCommand(int playerId, int ack_id, int territoryId)
	{
		super(playerId, ack_id);
		this.territoryId = territoryId;
	}

	public int getTerritoryId()
	{
		return territoryId;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.ASSIGN_ARMY;
	}

	@Override
	public String toJSON()
	{
		return null;
	}
}
