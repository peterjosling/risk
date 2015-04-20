package uk.ac.standrews.cs.cs3099.risk.game;

/**
 * Card Class
 * A single card in the deck
 */
public class Card {

	public enum CardType {
		INFANTRY,
		CAVALRY,
		ARTILLERY,
		WILD
	}

	// Will need cryptographic extensions at a later date
	private int id;
	private int territoryId;
	private CardType type;


	public Card(int id, int territoryId, CardType type)
	{
		this.id = id;
		this.territoryId = territoryId;
		this.type = type;
	}

	public int getId()
	{
		return id;
	}

	public int getTerritoryId()
	{
		return territoryId;
	}

	public CardType getCardType()
	{
		return type;
	}

	public String toString()
	{
		String cardtype;

		if (type == CardType.INFANTRY) {
			cardtype = "Infantry";
		} else if (type == CardType.CAVALRY) {
			cardtype = "Cavalry";
		} else if (type == CardType.ARTILLERY) {
			cardtype = "Artillery";
		} else if (type == CardType.WILD) {
			cardtype = "Wild";
		} else {
			cardtype = "UNKNOWN";
		}

		return id + " " + cardtype;
	}

}
