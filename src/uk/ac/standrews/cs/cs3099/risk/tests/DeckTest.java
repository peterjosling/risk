package uk.ac.standrews.cs.cs3099.risk.tests;

import org.junit.*;
import uk.ac.standrews.cs.cs3099.risk.game.Card;
import uk.ac.standrews.cs.cs3099.risk.game.Deck;
import uk.ac.standrews.cs.cs3099.risk.game.Player;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;

import static org.junit.Assert.*;

public class DeckTest {

	Deck deck1;
	Deck deck2;

	@Before
	public void setup() {
		deck1 = new Deck(44);
		deck2 = new Deck(60);
	}

	@Test
	public void deckContentsTest() {
		ArrayList<Card> cards = deck1.getDeck();
		assertEquals(44, cards.size());
		assertEquals(Card.CardType.INFANTRY, cards.get(0).getCardType());
		assertEquals(Card.CardType.INFANTRY, cards.get(13).getCardType());
		assertEquals(Card.CardType.CAVALRY, cards.get(14).getCardType());
		assertEquals(Card.CardType.CAVALRY, cards.get(27).getCardType());
		assertEquals(Card.CardType.ARTILLERY, cards.get(28).getCardType());
		assertEquals(Card.CardType.ARTILLERY, cards.get(41).getCardType());
		assertEquals(Card.CardType.WILD, cards.get(42).getCardType());
		assertEquals(Card.CardType.WILD, cards.get(43).getCardType());

		ArrayList<Card> cards2 = deck2.getDeck();
		assertEquals(60, cards2.size());
		assertEquals(Card.CardType.INFANTRY, cards2.get(0).getCardType());
		assertEquals(Card.CardType.INFANTRY, cards2.get(19).getCardType());
		assertEquals(Card.CardType.CAVALRY, cards2.get(20).getCardType());
		assertEquals(Card.CardType.CAVALRY, cards2.get(39).getCardType());
		assertEquals(Card.CardType.ARTILLERY, cards2.get(40).getCardType());
		assertEquals(Card.CardType.ARTILLERY, cards2.get(59).getCardType());
	}

	@Test
	public void dealCardTest(){
		InetAddress address;
		Player p1 = null;
		try {
			address = InetAddress.getLocalHost();
			p1 = new Player(1, address, (short) 1,"testPlayer");
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		ArrayList<Card> cards = deck1.getDeck();
		assertTrue(cards.get(0).getId() == 0);
		assertEquals(44, cards.size());
		deck1.dealCard(p1);
		assertTrue(cards.get(0).getId() == 1);
		assertEquals(43, cards.size());
	}



}
