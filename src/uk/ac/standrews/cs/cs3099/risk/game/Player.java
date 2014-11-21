package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;

/**
 * Player Class
 * Abstractions of what every player should have (including local)
 */
public abstract class Player {

    // Unique per-player values
    private int id;
    private String name;

    // Game state properties
    private List<Card> usedcards;
    private List<Card> hiddencards;

    private int totalarmies;
    private List<Territory> ownedterritories;

    public Player(int id, String name)
    {
        this.id = id;
        this.name = name;

        usedcards = new ArrayList<Card>();
        hiddencards = new ArrayList<Card>();

        totalarmies = 0;
        ownedterritories = new ArrayList<Territory>();
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

	public abstract Move getMove();
	public abstract void notifyMove(Move move);
}
