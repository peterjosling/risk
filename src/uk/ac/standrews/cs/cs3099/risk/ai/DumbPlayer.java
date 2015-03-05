package uk.ac.standrews.cs.cs3099.risk.ai;

import uk.ac.standrews.cs.cs3099.risk.commands.AssignArmyCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.DeployCommand.Deployment;
import uk.ac.standrews.cs.cs3099.risk.game.*;

import java.util.ArrayList;

public class DumbPlayer extends Player {
	private GameState state = new GameState(new ArrayList<Player>());
	private int ack_id = 0;

	public DumbPlayer(int id, String name)
	{
		super(id, name);
	}

	public Command getMove(CommandType type)
	{
		if (type == CommandType.ASSIGN_ARMY) {
			return getArmyAssignmentMove();
		} else if (type == CommandType.DEPLOY){
			return getDeployMove();			
		}

		return null;
	}

	public void notifyMove(Command move)
	{
		state.playMove(move, getId());
	}

	private DeployCommand getDeployMove() 
	{
		// Deploys all troops to first owned territory.
		Territory deployTerritory = state.getTerritoriesForPlayer(getId())[0];
		Deployment[] deployments = new Deployment[1];
		deployments[0] = new Deployment(deployTerritory.getId(), state.getDeployableArmies(getId()));
		
		return new DeployCommand(getId(), ++ack_id, deployments);
	}
	
	private AssignArmyCommand getArmyAssignmentMove()
	{
		// Pick the first free territory to claim.
		Territory[] freeTerritories = state.getUnclaimedTerritories();
		Territory territory = freeTerritories[0];
		return new AssignArmyCommand(getId(), ++ack_id, territory.getId());
	}
}
