package uk.ac.standrews.cs.cs3099.risk.tests;

import static org.junit.Assert.*;

import org.junit.Test;

import uk.ac.standrews.cs.cs3099.risk.game.DiceRoll;
import uk.ac.standrews.cs.cs3099.risk.game.Die;
import uk.ac.standrews.cs.cs3099.risk.game.Logger;

public class DiceRollTest {
	
	private Logger logger = new Logger();
	private DiceRoll diceRoll = new DiceRoll();

	/**
	 * Test to ensure that two dice rolls are returned.
	 */
	@Test
	public void rollTwoDie() 
	{
			int rollResult[] = diceRoll.rollDie(2);

			assertEquals(rollResult.length, 2);
			
			assertTrue(rollResult[0] <= 6 && rollResult[0] >= 1); // Asserts if roll is not between 1 and 6
			assertTrue(rollResult[1] <= 6 && rollResult[1] >= 1); // Asserts if roll is not between 1 and 6

	}
	
	/**
	 * Test to ensure that it returns one die roll.
	 */
	@Test
	public void rollOneDie() 
	{
			int rollResult[] = diceRoll.rollDie(1);

			assertEquals(rollResult.length, 1);
			
			assertTrue(rollResult[0] <= 6 && rollResult[0] >= 1); // Asserts if roll is not between 1 and 6

	}

}
