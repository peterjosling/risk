package uk.ac.standrews.cs.cs3099.risk.tests;

<<<<<<< HEAD
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
=======
import org.junit.*;
import uk.ac.standrews.cs.cs3099.risk.game.Continent;
import uk.ac.standrews.cs.cs3099.risk.game.Territory;

import static org.junit.Assert.*;

public class TerritoryTest {

	private Continent continent1;
	private Continent continent2;
	Territory territory1;
	Territory territory2;
	Territory territory3;
	Territory territory4;

	@Before
	public void setup() {
		continent1 = new Continent(1);
		territory1 = new Territory(1, continent1);
		territory2 = new Territory(2, continent1);
		territory3 = new Territory(3, continent1);
		territory4 = new Territory(4, continent2);
	}

	@Test
	public void getIdTest() {
		assertEquals(1, territory1.getId());
		assertEquals(2, territory2.getId());
		assertFalse(territory2.getId() == 1);
	}

	@Test
	public void addRemoveArmiesTest() {
		territory1.setArmies(3);
		territory2.setArmies(1);

		assertEquals(3, territory1.getArmies());
		assertEquals(1, territory2.getArmies());
		assertTrue(territory1.addArmies(2));
		assertTrue(territory2.addArmies(6));
		assertEquals(5, territory1.getArmies());
		assertEquals(7, territory2.getArmies());
		assertFalse(territory1.addArmies(-3));
		assertTrue(territory2.removeArmies(2));
		assertEquals(5, territory2.getArmies());
		assertFalse(territory2.removeArmies(5));
		assertFalse(territory2.removeArmies(6));
		assertFalse(territory2.removeArmies(-1));
	}

	@Test
	public void linkingTest() {
		territory1.addLink(territory2);
		territory1.addLink(territory3);
		territory1.addLink(territory4);
		territory2.addLink(territory1);
		territory2.addLink(territory4);
		territory3.addLink(territory1);
		territory4.addLink(territory1);
		territory4.addLink(territory2);

		assertTrue(territory1.isLinkedTo(territory2));
		assertTrue(territory1.isLinkedTo(territory3));
		assertTrue(territory1.isLinkedTo(territory4));
		assertTrue(territory2.isLinkedTo(territory1));
		assertTrue(territory2.isLinkedTo(territory4));
		assertTrue(territory3.isLinkedTo(territory1));
		assertTrue(territory4.isLinkedTo(territory1));
		assertTrue(territory4.isLinkedTo(territory2));

		assertFalse(territory2.isLinkedTo(territory3));
		assertFalse(territory3.isLinkedTo(territory4));
		assertFalse(territory4.isLinkedTo(territory3));

		assertTrue(territory1.getLinkedTerritories().contains(territory2));
		assertTrue(territory1.getLinkedTerritories().contains(territory3));
		assertTrue(territory1.getLinkedTerritories().contains(territory4));
		assertTrue(territory4.getLinkedTerritories().contains(territory1));
		assertTrue(territory4.getLinkedTerritories().contains(territory2));
		assertFalse(territory4.getLinkedTerritories().contains(territory3));
	}

}

>>>>>>> origin/master
