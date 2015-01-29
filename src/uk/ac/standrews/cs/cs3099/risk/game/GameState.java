package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.HashSet;

/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

    private HashSet<Player> players;
    private Map map;


    public GameState()
    {
        // This is the core right here - careful thought needs to be put
        // into this so I'll leave it for discussion
    }

    public void loadMap(String json) throws MapParseException
    {
        map = new Map();

        map.parseMapData(json);
    }
}
