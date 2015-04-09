package uk.ac.standrews.cs.cs3099.risk.commands;

import uk.ac.standrews.cs.cs3099.risk.game.Card;

public class PlayCardsCommand extends Command {
	private String command = "play_cards";
	private Card[][] payload;

	public PlayCardsCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public PlayCardsCommand(int playerId, int ackId, Card[][] cards)
	{
		this(playerId, ackId);
		this.payload = cards;
	}

	/**
	 * @return Array of {@link Card} instances. Should be length 3, all unique and all of same type to be valid.
	 */
	public Card[][] getCards()
	{
		return payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.PLAY_CARDS;
	}
}
