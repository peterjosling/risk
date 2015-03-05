package uk.ac.standrews.cs.cs3099.risk.ai;

import uk.ac.standrews.cs.cs3099.risk.game.Command;
import uk.ac.standrews.cs.cs3099.risk.game.DeployCommand.Deployment;

import java.util.ArrayList;

public class DumbPlayer extends Player {
	private GameState state = new GameState(new ArrayList<Player>());
	private int ack_id = 0;

	public DumbPlayer(int id, String name)
	{
		super(id, name);
	}

	public Command getMove(MoveType type)
	{
		if (type == MoveType.ASSIGN_ARMY) {
			return getArmyAssignmentMove();
		} else if (type == MoveType.DEPLOY){
			return getDeployMove();			
		}

		return null;
	}

	public void notifyMove(Command command)
	{
		state.playMove(command, getId());
	}

	private DeployMove getDeployMove() 
	{
		// Deploys all troops to first owned territory.
		Territory deployTerritory = state.getTerritoriesForPlayer(getId())[0];
		Deployment[] deployments = new Deployment[1];
		deployments[0] = new Deployment(deployTerritory.getId(), state.getDeployableArmies(getId()));
		
		return new DeployMove(getId(), ++ack_id, deployments);
	}
	
	private AssignArmyMove getArmyAssignmentMove()
	{
		// Pick the first free territory to claim.
		Territory[] freeTerritories = state.getUnclaimedTerritories();
		Territory territory = freeTerritories[0];
		return new AssignArmyMove(getId(), ++ack_id, territory.getId());
	}
}
