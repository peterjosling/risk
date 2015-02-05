package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.Random;

/**
 * Die Class
 * Represents one die with 6 faces.
 */
public class Die {

	Random rand = new Random();
	
	private int faceValue;
	
	/**
	 * Die Constructor initialises the face value to 1.
	 */
	public Die()
	{
		faceValue = 1;
	}
	
	/**
	 * Simple implementation of die roll
	 * @return die roll
	 */
	public int roll()
	{
		faceValue = rand.nextInt(6) + 1;
		return faceValue;
	}
}
