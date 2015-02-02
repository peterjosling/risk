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

        for (int i = 0; i < 25; i++)
            Logger.print(m.getRandomName(r));

        System.exit(0);
    }

}
