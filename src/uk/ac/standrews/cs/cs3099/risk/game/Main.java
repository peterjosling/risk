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

        System.exit(0);
    }

}
