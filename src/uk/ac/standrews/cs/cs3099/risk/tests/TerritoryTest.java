package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;
import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.game.*;


public class TerritoryTest {

    @Test
    public void gettersAndSetters() {
        Continent c = new Continent(1);
        Territory t1 = new Territory(1, c);
        Territory t2 = new Territory(2, c);

        t1.setArmies(1);
        t1.addLink(t2);

        assertTrue(1 == t1.getId());
        assertTrue(1 == t1.getArmies());
        assertTrue(t1.isLinkedTo(t2));
    }
}
