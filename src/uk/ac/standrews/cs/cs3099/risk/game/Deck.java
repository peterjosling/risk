package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;

/**
 * The deck which cards are drawn from.
 */
public class Deck {

	private ArrayList<Card> cards;
	private int topCardIndex = 0;

	public Deck(int size)
	{
		cards = new ArrayList<Card>(size);
	}

	public ArrayList<Card> getDeck()
	{
		return cards;
	}

	public int getTopCardIndex()
	{
		return topCardIndex;
	}

	/**
	 * Adds a card to the cards list with the given parameters
	 *
	 * @param id          - card id
	 * @param territoryId - cards territory id
	 * @param type        - the cards type i.e. INFANTRY, CAVALRY, ARTILLERY, WILD
	 */
	public void addCardToDeck(int id, int territoryId, Card.CardType type)
	{
		cards.add(new Card(id, territoryId, type));
	}


	/**
	 * Deals the card on the top of the deck i.e. the card at the front of the array list of
	 * cards to the specified player.
	 */
	public Card dealCard()
	{
		Card topCard = cards.get(topCardIndex);
		topCardIndex++;
		return topCard;
	}

	/**
	 * Shuffle the cards list currently using java.util.Random until random number generator decided.
	 *
	 * @param d - the seeded random die class
	 */
	public void shuffle(Die d)
	{
		for (int i = 0; i < cards.size(); i++) {
			int j = (int)(d.nextInt() % cards.size());
			Collections.swap(cards, i, j);
		}
	}

}
