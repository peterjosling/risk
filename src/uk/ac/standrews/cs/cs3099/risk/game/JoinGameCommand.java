package uk.ac.standrews.cs.cs3099.risk.game;

public class JoinGameCommand extends Command {
	private float[] supported_versions;
	private String[] supported_features;
	
	public JoinGameCommand(int ackId)
	{
		super(-1, ackId);
	}
	
	public JoinGameCommand(int playerId, int ackId, float[] supported_versions,
						   String[] supported_features)
	{
		super(-1, ackId);
		this.supported_versions = supported_versions;
		this.supported_features = supported_features;
	}

	public float[] getSupported_versions() 
	{
		return supported_versions;
	}

	public String[] getSupported_features() 
	{
		return supported_features;
	}

	@Override
	public MoveType getType() 
	{
		return MoveType.JOIN_GAME;
	}

}