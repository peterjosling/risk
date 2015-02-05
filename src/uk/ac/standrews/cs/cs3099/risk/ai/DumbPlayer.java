package uk.ac.standrews.cs.cs3099.risk.ai;

import uk.ac.standrews.cs.cs3099.risk.game.*;

public class DumbPlayer extends Player {
	private GameState state = new GameState();
	private int ack_id = 0;

	public DumbPlayer(int id, String name)
	{
		super(id, name);
	}

	public Move getMove(MoveType type)
	{
		if (type == MoveType.ASSIGN_ARMY) {
			return getArmyAssignmentMove();
		}

		return null;
	}

	public void notifyMove(Move move)
	{
		// No-op. Dumb player ignores move input.
	}

	private AssignArmyMove getArmyAssignmentMove()
	{
		// Pick the first free territory to claim.
		Territory[] freeTerritories = state.getUnclaimedTerritories();
		Territory territory = freeTerritories[0];
		return new AssignArmyMove(getId(), ++ack_id, territory.getId());
	}
}
