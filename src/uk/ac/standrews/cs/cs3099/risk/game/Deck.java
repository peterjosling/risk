package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;

/**
 * Created by nicholaskneeshaw on 21/01/15.
 */
public class Deck {

	public ArrayList cards;

	public Deck(String order){ //do decks have a set size when created???
		cards = new ArrayList<Card>();
	}

	public void addCardToDeck(int id, int territoryId, Card.CardType type){
		 cards.add(new Card(id, territoryId, type));
	}

	public void dealCard(Player player){
		Card topCard = (Card)cards.get(0);
		player.addCard(topCard);
		cards.remove(0);
	}

	public void shuffle(ArrayList cards){

	}

}
