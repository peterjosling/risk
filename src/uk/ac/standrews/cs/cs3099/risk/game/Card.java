package uk.ac.standrews.cs.cs3099.risk.game;

/**
 * Card Class
 * A single card in the deck
 */
public class Card {

    public enum CardType {
        INFANTRY,
        CAVALRY,
        ARTILLERY
    }

    // Will need cryptographic extensions at a later date
    private int id;
    private int territoryid;
    private CardType type;


    public Card(int id, int territoryid, CardType type)
    {
        this.id = id;
        this.territoryid = territoryid;
        this.type = type;
    }

    public int getId()
    {
        return id;
    }

    public int getTerritoryId()
    {
        return territoryid;
    }

    public CardType getCardType()
    {
        return type;
    }

}
