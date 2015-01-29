package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;
import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.game.*;

import java.util.Set;


public class ContinentTest {

    @Test
    public void gettersAndSetters() {
        Continent c = new Continent(1);

        c.setContinentValue(1);

        assertTrue(1 == c.getId());
        assertTrue(1 == c.getContinentValue());
    }

    @Test
    public void territorySet() {
        Continent c = new Continent(1);
        Territory t1 = new Territory(1, c);
        Territory t2 = new Territory(2, c);
        Set<Territory> territories;

        c.addTerritory(t1);
        c.addTerritory(t2);

        territories = c.getTerritories();

        assertTrue(territories.contains(t1));
        assertTrue(territories.contains(t2));
    }
}
