package uk.ac.standrews.cs.cs3099.risk.game;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Random;

/**
 * Main Class
 * Deals with orchestration of the entire game
 */
public class Main {

	public static void main(String[] args)
	{
		String json = "";

	    BufferedReader br;
		try {
			br = new BufferedReader(new FileReader("default-map.json"));
			StringBuilder sb = new StringBuilder();
	        String line = br.readLine();

	        while (line != null) {
	            sb.append(line);
	            line = br.readLine();
	        }
	        json = sb.toString();

	        br.close();
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		json = json.replaceAll("\t", "");

		System.out.println(json);

		Random r = new Random();

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

		try {
			LocalGame localGame = new LocalGame(json, 4, 10);
			localGame.run();
		} catch (MapParseException e) {
			e.printStackTrace();
		}

		System.exit(0);
	}
}
