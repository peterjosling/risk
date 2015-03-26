package uk.ac.standrews.cs.cs3099.risk.commands;

public class PlayersJoinedCommand extends Command {
	private String[][] playerNames;
	
	public PlayersJoinedCommand(String[][] playerNames)
	{
		super(-1);
		this.playerNames = playerNames;
	}
	
	/**
	 * @return 2D array of player ID/name pairs.
	 */
	public String[][] getPlayerNames()
	{
		return playerNames;
	}
	
	@Override
	public CommandType getType() 
	{
		return CommandType.PLAYERS_JOINED;
	}

}
