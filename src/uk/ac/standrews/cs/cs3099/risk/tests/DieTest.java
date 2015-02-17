package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;

import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.game.Die;
import uk.ac.standrews.cs.cs3099.risk.game.Logger;

public class DieTest {

	private Logger logger = new Logger();
	private Die die1 = new Die();

	/**
	 * Test to ensure that each roll is between 1 and 6.
	 */
	@Test
	public void correctRoll()
	{
		for (int i = 0, rollResult = die1.roll(); i < 12; i++, rollResult = die1.roll()) {
			assertTrue(rollResult <= 6 && rollResult >= 1); // Asserts if roll is not between 1 and 6
		}
	}

}
