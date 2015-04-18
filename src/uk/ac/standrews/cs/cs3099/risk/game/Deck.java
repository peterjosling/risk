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

	public Deck(int size) {
		cards = new ArrayList<Card>(size);
		populateDeck();
	}

	public ArrayList<Card> getDeck() {
		return cards;
	}

	public int getTopCardIndex() {
		return topCardIndex;
	}

	/**
	 * Adds a card to the cards list with the given parameters
	 *
	 * @param id          - card id
	 * @param territoryId - cards territory id
	 * @param type        - the cards type i.e. INFANTRY, CAVALRY, ARTILLERY, WILD
	 */
	public void addCardToDeck(int id, int territoryId, Card.CardType type) {
		cards.add(new Card(id, territoryId, type));
	}


	public void populateDeck() {
		addCardToDeck(0, 0, Card.CardType.ARTILLERY);
		addCardToDeck(1, 1, Card.CardType.CAVALRY);
		addCardToDeck(2, 2, Card.CardType.CAVALRY);
		addCardToDeck(3, 3, Card.CardType.ARTILLERY);
		addCardToDeck(4, 4, Card.CardType.ARTILLERY);
		addCardToDeck(5, 5, Card.CardType.ARTILLERY);
		addCardToDeck(6, 6, Card.CardType.ARTILLERY);
		addCardToDeck(7, 7, Card.CardType.ARTILLERY);
		addCardToDeck(8, 8, Card.CardType.INFANTRY);
		addCardToDeck(9, 9, Card.CardType.CAVALRY);
		addCardToDeck(10, 10, Card.CardType.CAVALRY);
		addCardToDeck(11, 11, Card.CardType.INFANTRY);
		addCardToDeck(12, 12, Card.CardType.INFANTRY);
		addCardToDeck(13, 13, Card.CardType.CAVALRY);
		addCardToDeck(14, 14, Card.CardType.INFANTRY);
		addCardToDeck(15, 15, Card.CardType.INFANTRY);
		addCardToDeck(16, 16, Card.CardType.INFANTRY);
		addCardToDeck(17, 17, Card.CardType.CAVALRY);
		addCardToDeck(18, 18, Card.CardType.INFANTRY);
		addCardToDeck(19, 19, Card.CardType.INFANTRY);
		addCardToDeck(20, 20, Card.CardType.INFANTRY);
		addCardToDeck(21, 21, Card.CardType.CAVALRY);
		addCardToDeck(22, 22, Card.CardType.ARTILLERY);
		addCardToDeck(23, 23, Card.CardType.INFANTRY);
		addCardToDeck(24, 24, Card.CardType.ARTILLERY);
		addCardToDeck(25, 25, Card.CardType.CAVALRY);
		addCardToDeck(26, 26, Card.CardType.INFANTRY);
		addCardToDeck(27, 27, Card.CardType.INFANTRY);
		addCardToDeck(28, 28, Card.CardType.ARTILLERY);
		addCardToDeck(29, 29, Card.CardType.ARTILLERY);
		addCardToDeck(30, 30, Card.CardType.ARTILLERY);
		addCardToDeck(31, 31, Card.CardType.CAVALRY);
		addCardToDeck(32, 32, Card.CardType.CAVALRY);
		addCardToDeck(33, 33, Card.CardType.INFANTRY);
		addCardToDeck(34, 34, Card.CardType.ARTILLERY);
		addCardToDeck(35, 35, Card.CardType.ARTILLERY);
		addCardToDeck(36, 36, Card.CardType.CAVALRY);
		addCardToDeck(37, 37, Card.CardType.CAVALRY);
		addCardToDeck(38, 38, Card.CardType.INFANTRY);
		addCardToDeck(39, 39, Card.CardType.CAVALRY);
		addCardToDeck(40, 40, Card.CardType.ARTILLERY);
		addCardToDeck(41, 41, Card.CardType.CAVALRY);
		addCardToDeck(42, -1, Card.CardType.WILD);
		addCardToDeck(43, -1, Card.CardType.WILD);
	}


	/**
	 * Deals the card on the top of the deck i.e. the card at the front of the array list of
	 * cards to the specified player.
	 */
	public Card dealCard() {
		Card topCard = cards.get(topCardIndex);
		topCardIndex++;
		return topCard;
	}

	/**
	 * Shuffle the cards list currently using java.util.Random until random number generator decided.
	 *
	 * @param seed - seed for random number generator
	 */
	public void shuffle(long seed) {
		Random ranGenerator = new Random();
		ranGenerator.setSeed(seed);
		for (int i = 0; i < cards.size(); i++) {
			int j = (ranGenerator.nextInt(Integer.MAX_VALUE) % cards.size());
			Collections.swap(cards, i, j);
		}
	}

}
