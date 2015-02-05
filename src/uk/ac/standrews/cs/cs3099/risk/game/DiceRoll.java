package uk.ac.standrews.cs.cs3099.risk.game;

/**
 * Dice Rolling Class
 * Provides all Dice Rolling Functionality
 */
public class DiceRoll {
	
	public Die die = new Die();
	
	public int[] rollDie(int numOfRolls)
	{
		int[] diceRolls = new int[numOfRolls];

		for(int n = 0; n < numOfRolls; n++){
			diceRolls[n] = die.roll();
		}
		return diceRolls;
	}
}
