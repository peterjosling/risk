package uk.ac.standrews.cs.cs3099.risk.commands;

public class PlayersJoinedCommand extends Command {
	private PlayersNames[] playerNames;

	public PlayersJoinedCommand(PlayersNames[] playerNames)
	{
		super(-1);
		this.playerNames = playerNames;
	}

	/**
	 * @return 2D array of player ID/name pairs.
	 */
	public PlayersNames[] getPlayerNames()
	{
		return playerNames;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.PLAYERS_JOINED;
	}

	public class PlayersNames {
		private int playerId;
		private String playerName;
		private String publicKey;

		public int getPlayerId()
		{
			return playerId;
		}

		public String getPlayerName()
		{
			return playerName;
		}

		public String getPublicKey()
		{
			return publicKey;
		}
	}

}
