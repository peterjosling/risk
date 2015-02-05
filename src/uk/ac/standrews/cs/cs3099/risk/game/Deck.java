package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;

/**
 * The deck which cards are drawn from.
 */
public class Deck {

	private ArrayList<Card> cards;

	public Deck(int size)
	{
		cards = new ArrayList<Card>(size);
		populateDeck(size);
	}

	public ArrayList<Card> getDeck()
	{
		return cards;
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
	 * Fills deck with an equal number of Infantry, Cavalry and Artillery cards with a given deck size.
	 * Any remaining space will be made up of wild cards, so this can mean there are between 0-2 wild cards
	 * in a game.
	 *
	 * @param size
	 */
	public void populateDeck(int size)
	{
		Card.CardType cardType = Card.CardType.INFANTRY;
		Card.CardType cardTypes[] = Card.CardType.values();
		int numberOfEachCard = size / 3;
		int cardIndex = 0;
		int territoryID = 0;
		for (int cardNumber = 0; cardNumber < size; cardNumber++) {
			if (cardNumber % numberOfEachCard == 0) { //Changes cardType
				cardType = cardTypes[cardIndex];
				cardIndex++;
			}
			addCardToDeck(cardNumber, territoryID, cardType);
			if (cardType == Card.CardType.WILD) {
				territoryID = -1;
			} else territoryID++;
		}
	}

	/**
	 * Deals the card on the top of the deck i.e. the card at the front of the array list of
	 * cards to the specified player.
	 *
	 * @param player - the player the card will be dealt to
	 */
	public void dealCard(Player player)
	{
		Card topCard = cards.get(0);
		player.addCard(topCard);
		cards.remove(0);
	}

	/**
	 * Shuffle the cards list currently using java.util.Random until random number generator decided.
	 * @param seed  - seed for random number generator
	 */
	public void shuffle(long seed)
	{
		Random ranGenerator = new Random();
		ranGenerator.setSeed(seed);
		for (int i = 0; i < cards.size(); i++) {
			int j = (ranGenerator.nextInt(Integer.MAX_VALUE) % cards.size());
			Collections.swap(cards, i, j);
		}
	}

}
