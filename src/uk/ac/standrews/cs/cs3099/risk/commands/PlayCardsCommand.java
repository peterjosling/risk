package uk.ac.standrews.cs.cs3099.risk.commands;

public class PlayCardsCommand extends Command {
	private String command = "play_cards";
	private PlayCardsPayload payload;

	public PlayCardsCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public PlayCardsCommand(int playerId, int ackId, int[][] cards)
	{
		this(playerId, ackId);

		if (cards != null) {
			this.payload = new PlayCardsPayload();
			this.payload.cards = cards;
			this.payload.armies = -1;
		}

		System.out.println("Created");
	}

	/**
	 * @return Array of card IDs. Should be length 3, all unique and all of same type to be valid.
	 * Returns null if the command has no payload.
	 */
	public int[][] getCards()
	{
		if (payload == null) {
			return null;
		}

		return payload.cards;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.PLAY_CARDS;
	}

	private class PlayCardsPayload {
		int[][] cards;
		int armies;
	}
}
