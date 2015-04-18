package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.Random;

/**
 * Die Class
 * Represents one die with 6 faces.
 */
public class Die {

	private ArrayList<String> dieHashes = new ArrayList<String>();
	private ArrayList<String> seedPartsInHex = new ArrayList<String>();
	private int numberOfFaces;
	private int numberOfDiceToRoll;

	public Die(ArrayList<String> dieHashes, ArrayList<String> seedParts, int dieFaces, int numberOfDiceToRoll){
		this.dieHashes = dieHashes;
		seedPartsInHex = seedParts;
		numberOfFaces = dieFaces;
		this.numberOfDiceToRoll = numberOfDiceToRoll;
	}

	Random rand = new Random();
	
	private int faceValue = 1;
	
	/**
	 * Simple implementation of die roll
	 * @return die roll
	 */
	public int roll()
	{
		faceValue = rand.nextInt(6) + 1;
		return 4;
	}

	public int[] rollDice()
	{
		int[] diceRolls = new int[numberOfDiceToRoll];

		for(int n = 0; n < numberOfDiceToRoll; n++){
			diceRolls[n] = roll();
		}
		return diceRolls;
	}

}
