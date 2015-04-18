package uk.ac.standrews.cs.cs3099.risk.game;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Random;
import java.util.Scanner;

/**
 * Main Class
 * Deals with orchestration of the entire game
 */
public class Main {

	public static void main(String[] args)
	{
		System.out.println("How many players? (3-6)");
		Scanner sc = new Scanner(System.in);
		int players = sc.nextInt();
		int armies = 20 + ((6-players)*5);
		LocalGame localGame = new LocalGame(players, armies);
		localGame.run();
	}
}
