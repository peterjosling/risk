package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.HashSet;

/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

    private HashSet<Player> players;
    private Map map;
    private Object deck;


    public GameState()
    {
        deck = new Object();
    }

    public void loadMap(String json) throws MapParseException
    {
        map = new Map();

        map.parseMapData(json);
    }
}
