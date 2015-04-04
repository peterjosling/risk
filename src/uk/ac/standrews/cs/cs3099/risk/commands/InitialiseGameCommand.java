package uk.ac.standrews.cs.cs3099.risk.commands;

public class InitialiseGameCommand extends Command {
	private int version;
	private String[] supportedFeatures;
	
	public InitialiseGameCommand(int PlayerId, int version,
			String[] supportedFeatures) 
	{
		super(PlayerId);
		this.version = version;
		this.supportedFeatures = supportedFeatures;
	}
	
	/**
	 * @return Integer - game protocol version used.
	 */
	public int getVersion()
	{
		return version;
	}
	
	/**
	 * @return String Array of extra features enabled.
	 */
	public String[] getSupportedFeatures()
	{
		return supportedFeatures;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.INITIALISE_GAME;
	}
}
