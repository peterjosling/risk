package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.Collections;

/**
 * The deck which cards are drawn from.
 */
public class Deck {

	private ArrayList cards;

	public Deck(String order, int size){ //do decks have a set size when created???
		cards = new ArrayList<Card>(size);
	}

	/**
	 * Adds a card to the cards list with the given parameters
	 * @param id - card id
	 * @param territoryId - cards territory id
	 * @param type - the cards type i.e. INFANTRY, CAVALRY, ARTILLERY, WILD
	 */
	public void addCardToDeck(int id, int territoryId, Card.CardType type){
		 cards.add(new Card(id, territoryId, type));
	}

	/**
	 * Deals the card on the top of the deck i.e. the card at the front of the array list of
	 * cards to the specified player.
	 * @param player - the player the card will be dealt to
	 */
	public void dealCard(Player player){
		Card topCard = (Card)cards.get(0);
		player.addCard(topCard);
		cards.remove(0);
	}

	/**
	 * Shuffle the cards list using the collections shuffle method until shuffle algorithm is agreed upon.
	 * @param cards - the list to be shuffled
	 */
	public void shuffle(ArrayList cards){
		Collections.shuffle(cards);
	}

}
