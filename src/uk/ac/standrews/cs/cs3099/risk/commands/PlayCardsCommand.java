package uk.ac.standrews.cs.cs3099.risk.commands;

import uk.ac.standrews.cs.cs3099.risk.game.Card;

public class PlayCardsCommand extends Command {
	private String command = "play_cards";
	private PlayCardsPayload payload = new PlayCardsPayload();

	public PlayCardsCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public PlayCardsCommand(int playerId, int ackId, Card[][] cards)
	{
		this(playerId, ackId);
		this.payload.cards = cards;
		this.payload.armies = -1;

		if (cards == null) {
			this.payload = null;
		}
	}

	/**
	 * @return Array of {@link Card} instances. Should be length 3, all unique and all of same type to be valid.
	 * Returns null if the command has no payload.
	 */
	public Card[][] getCards()
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
		Card[][] cards;
		int armies;
	}
}
