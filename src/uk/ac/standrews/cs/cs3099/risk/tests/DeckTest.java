package uk.ac.standrews.cs.cs3099.risk.tests;

import org.junit.*;
import uk.ac.standrews.cs.cs3099.risk.game.Card;
import uk.ac.standrews.cs.cs3099.risk.game.Deck;
import uk.ac.standrews.cs.cs3099.risk.game.LocalPlayer;
import uk.ac.standrews.cs.cs3099.risk.game.Player;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;

import static org.junit.Assert.*;

public class DeckTest {

	//Deck deck1;

	/*
	@Before
	public void setup()
	{
		deck1 = new Deck(44);
	}

	@Test
	public void dealCardTest()
	{
		ArrayList<Card> cards = deck1.getDeck();
		assertTrue(cards.get(0).getId() == 0);
		assertEquals(44, cards.size());
		assertEquals(0, deck1.getTopCardIndex());
		deck1.dealCard();
		assertEquals(1, deck1.getTopCardIndex());
		assertTrue(cards.get(deck1.getTopCardIndex()).getId() == 1);
	}
	*/

	/*
	@Test
	public void shuffleTest()
	{
		ArrayList<Card> cards = deck1.getDeck();
		ArrayList<Card> cardsCopy = new ArrayList<Card>();
		for (Card card : cards) {
			cardsCopy.add(card);
		}
		assertEquals(cards, cardsCopy);
		assertNotSame(cards, cardsCopy);
		deck1.shuffle(12345678);
		assertFalse(cards.equals(cardsCopy));
	}
	*/

}
