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
		
		
		try {
			LocalGame localGame = new LocalGame(json, 4, 10);
			localGame.run();
		} catch (MapParseException e) {
			e.printStackTrace();
		}
	}
}
