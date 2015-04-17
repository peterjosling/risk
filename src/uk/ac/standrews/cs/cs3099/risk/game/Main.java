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
			br = new BufferedReader(new FileReader("risk_map.json"));
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
		try {
			LocalGame game = new LocalGame(json, 4, 10);
			game.run();
		} catch (MapParseException e) {
			e.printStackTrace();
		}
//		Logger.print("Risk - Have some countries:");
//
//		Map m = new Map();
//		Random r = new Random();
//		Player p = new LocalPlayer(0);
//
//		for (int i = 0; i < 25; i++)
//			Logger.print(m.getRandomName(r));
//
//		Logger.print("------------------------------------------------------------------------------");
//		Logger.print("Risk - And some player names:");
//
//		for (int i = 0; i < 25; i++)
//			Logger.print(p.genName());
//
//		System.exit(0);
	}
}
