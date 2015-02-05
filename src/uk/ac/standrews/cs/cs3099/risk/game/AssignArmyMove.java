package uk.ac.standrews.cs.cs3099.risk.game;

public class AssignArmyMove extends Move {
	private int territoryId;

	public AssignArmyMove(int territoryId, int ack_id)
	{
		super(ack_id);
		this.territoryId = territoryId;
	}

	public int getTerritoryId()
	{
		return territoryId;
	}

	@Override
	public MoveType getType()
	{
		return MoveType.ASSIGN_ARMY;
	}
}
