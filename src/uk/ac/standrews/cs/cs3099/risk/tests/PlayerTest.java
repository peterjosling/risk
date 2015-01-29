package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;
import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.game.*;


public class PlayerTest {

    @Test
    public void gettersAndSetters() {
        Player p = new Player(1, "Bob");
        Continent c = new Continent(1);
        Territory t = new Territory(1, c);


        assertTrue(1 == c.getId());
        assertTrue(1 == c.getTerritoryId());
        assertTrue(Card.CardType.WILD == c.getCardType());
    }
}
