package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.Random;

/**
 * Main Class
 * Deals with orchestration of the entire game
 */
public class Main {

	public static void main(String[] args)
	{
		Logger.print("Risk - Have some countries:");

		Map m = new Map();
		Random r = new Random();
		Player p = new LocalPlayer(0);

		for (int i = 0; i < 25; i++)
			Logger.print(m.getRandomName(r));

		Logger.print("------------------------------------------------------------------------------");
		Logger.print("Risk - And some player names:");

		for (int i = 0; i < 25; i++)
			Logger.print(p.genName());

		Logger.print("------------------------------------------------------------------------------");
		Logger.print("Risk - Some random bytes, generated with seed='Key' - RandomNumbers(\"4B6579\"):");

		RandomNumbers rn = new RandomNumbers("4B6579"); // Seeding with 'Key'
		for (int i = 0; i < 10; i++)
			System.out.printf("%02X", rn.getRandomByte() & 0xFFL);
		System.out.println();

		Logger.print("------------------------------------------------------------------------------");
		Logger.print("Risk - A random int, generated with seed='Key' - RandomNumbers(\"4B6579\"):");

		rn = new RandomNumbers("4B6579");
		System.out.printf("%08X\n", rn.getRandomInt() & 0xFFFFFFFFL);

		System.exit(0);
	}
}
