package uk.ac.standrews.cs.cs3099.risk.game;

public class DeployMove extends Move {
	private Deployment[] deployments;

	public DeployMove(int playerId, int ackId, Deployment[] deployments)
	{
		super(playerId, ackId);
		this.deployments = deployments;
	}

	public Deployment[] getDeployments()
	{
		return deployments;
	}

	@Override
	public MoveType getType()
	{
		return MoveType.DEPLOY;
	}

	public class Deployment {
		private int territoryId;
		private int armies;

		public int getTerritoryId() {
			return territoryId;
		}

		public int getArmies() {
			return armies;
		}
	}
}
