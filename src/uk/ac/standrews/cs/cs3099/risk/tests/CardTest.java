package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;
import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.game.*;


public class CardTest {

    @Test
    public void gettersAndSetters() {
        Card c = new Card(1, 1, Card.CardType.WILD);

        assertTrue(1 == c.getId());
        assertTrue(1 == c.getTerritoryId());
        assertTrue(Card.CardType.WILD == c.getCardType());
    }
}
