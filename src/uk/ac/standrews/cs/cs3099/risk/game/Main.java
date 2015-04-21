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
		boolean acceptablePlayers = false;
		int players = 0;
		int ai = 0;
		while(!acceptablePlayers){
			System.out.println("How many players? (3-6)");
			Scanner sc = new Scanner(System.in);
			players = sc.nextInt();
			System.out.println("How many AI?");
			ai = sc.nextInt();
			if(ai + players > 2 && ai + players <7) {
				acceptablePlayers = true;
			} else {
				System.out.println("Please enter a total number of players between 3 and 6 (inclusive).");
			}
		}
		LocalGame localGame = new LocalGame(players, ai);
		localGame.run();
	}
}
