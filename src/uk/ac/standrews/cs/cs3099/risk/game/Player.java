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
    private List<Card> usedCards = new ArrayList<Card>();
    private List<Card> hiddenCards = new ArrayList<Card>();

    private int totalArmies = 0;
    private List<Territory> ownedTerritories = new ArrayList<Territory>();

    public Player(int id, String name)
    {
        this.id = id;
        this.name = name;
    }

    public boolean canPlaceArmies(Territory t)
    {
        return ownedTerritories.contains(t);
    }

    public boolean canMoveArmies(Territory src, Territory dst, int amount)
    {
        return src.getArmies() - 1 > amount && src.isLinkedTo(dst) &&
               ownedTerritories.contains(src) && ownedTerritories.contains(dst);
    }

    public void addCard(Card c)
    {
        hiddenCards.add(c);
    }

    public void playCard(Card c)
    {
        hiddenCards.remove(c);
        usedCards.add(c);
    }

	public abstract Move getMove();
	public abstract void notifyMove(Move move);
}
