package uk.ac.standrews.cs.cs3099.risk.commands;

public class JoinGameCommand extends Command {
	private JoinGamePayload payload = new JoinGamePayload();
	private String command = "join_game";

	public JoinGameCommand(float[] supported_versions, String[] supported_features)
	{
		super();
		this.payload.supported_versions = supported_versions;
		this.payload.supported_features = supported_features;
	}

	public float[] getSupported_versions()
	{
		return payload.supported_versions;
	}

	public String[] getSupported_features()
	{
		return payload.supported_features;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.JOIN_GAME;
	}

	private class JoinGamePayload {
		float[] supported_versions;
		String[] supported_features;
	}
}
