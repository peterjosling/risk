package uk.ac.standrews.cs.cs3099.risk.game;

import java.net.*;
import java.util.List;
import java.util.ArrayList;

/**
 * Player Class
 * Abstractions of what every player should have (including local)
 */
public class Player {

    // Unique per-player values
    private int id;
    private String name;

    // Game state properties
    private List<Card> usedcards;
    private List<Card> hiddencards;

    private int totalarmies;
    private List<Territory> ownedterritories;

    // Network properties
    private InetAddress address;
    private short port;
    private Socket connection;

    //private PublicKey pubkey;
    //private PrivateKey privkey;


    public Player(int id, InetAddress address, short port, String name)
    {
        this.id = id;
        this.name = name;

        usedcards = new ArrayList<Card>();
        hiddencards = new ArrayList<Card>();

        totalarmies = 0;
        ownedterritories = new ArrayList<Territory>();

        this.address = address;
        this.port = port;
        // Set up connection to other player here?
    }

    public boolean canPlaceArmies(Territory t)
    {
        return ownedterritories.contains(t);
    }

    public boolean canMoveArmies(Territory src, Territory dst, int amount)
    {
        return src.getArmies() - 1 > amount && src.isLinkedTo(dst) &&
               ownedterritories.contains(src) && ownedterritories.contains(dst);
    }

    public void addCard(Card c)
    {
        hiddencards.add(c);
    }

    public void playCard(Card c)
    {
        hiddencards.remove(c);
        usedcards.add(c);
    }

}
