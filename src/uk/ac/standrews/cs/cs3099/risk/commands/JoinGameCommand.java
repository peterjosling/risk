 package uk.ac.standrews.cs.cs3099.risk.commands;

public class JoinGameCommand extends Command {
	private float[] supportedVersions;
	private String[] supportedFeatures;
	
	public JoinGameCommand(int playerId, int ackId, float[] supportedVersions,
			String[] supportedFeatures) 
	{
		super(-1, ackId);
		this.supportedVersions = supportedVersions;
		this.supportedFeatures = supportedFeatures;
	}

	public float[] getSupportedVersions() 
	{
		return supportedVersions;
	}

	public String[] getSupportedFeatures() 
	{
		return supportedFeatures;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.JOIN_GAME;
	}

}
