package uk.ac.standrews.cs.cs3099.risk.commands;

public class DeployCommand extends Command {
	private String command = "deploy";
	private Deployment[] payload;

	public DeployCommand(int playerId, int ackId, Deployment[] deployments)
	{
		super(playerId, ackId);
		payload = deployments;
	}

	public Deployment[] getDeployments()
	{
		return payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.DEPLOY;
	}

	public static class Deployment {
		private int territoryId;
		private int armies;
		
		public Deployment(int id, int armies){
			this.territoryId = id;
			this.armies = armies;
		}

		public int getTerritoryId() {
			return territoryId;
		}

		public int getArmies() {
			return armies;
		}
	}
}
