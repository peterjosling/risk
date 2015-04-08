package uk.ac.standrews.cs.cs3099.risk.commands;

public class InitialiseGameCommand extends Command {
	private String command = "initialise_game";
	private InitialiseGamePayload payload = new InitialiseGamePayload();

	public InitialiseGameCommand(int version, String[] supportedFeatures)
	{
		super();
		this.payload.version = version;
		this.payload.supported_features = supportedFeatures;
	}

	/**
	 * @return Integer - game protocol version used.
	 */
	public int getVersion()
	{
		return payload.version;
	}

	/**
	 * @return String Array of extra features enabled.
	 */
	public String[] getSupportedFeatures()
	{
		return payload.supported_features;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.INITIALISE_GAME;
	}

	private class InitialiseGamePayload {
		int version;
		String[] supported_features;
	}
}
