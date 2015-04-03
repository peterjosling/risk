package uk.ac.standrews.cs.cs3099.risk.commands;

import uk.ac.standrews.cs.cs3099.risk.game.Card;

public class PlayCardsCommand extends Command {
	private Card[][] cards;

	public PlayCardsCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	public PlayCardsCommand(int playerId, int ackId, Card[][] cards)
	{
		this(playerId, ackId);
		this.cards = cards;
	}

	/**
	 * @return Array of {@link Card} instances. Should be length 3, all unique and all of same type to be valid.
	 */
	public Card[][] getCards()
	{
		return cards;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.TRADE_IN_CARDS;
	}

	@Override
	public String toJSON()
	{
		return null;
	}
}
