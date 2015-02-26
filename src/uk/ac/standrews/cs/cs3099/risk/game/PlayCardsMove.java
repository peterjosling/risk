package uk.ac.standrews.cs.cs3099.risk.game;

public class PlayCardsMove extends Move {
	private int[][] cards;
	private int armies;
	
	public PlayCardsMove(int playerId, int ackId) 
	{
		super(playerId, ackId);
	}
	
	public PlayCardsMove(int playerId, int ackId, int[][] cards, int armies) 
	{
		super(playerId, ackId);
		this.cards = cards;
		this.armies = armies;
	}

	public int[][] getCards() 
	{
		return cards;
	}

	public int getArmies() 
	{
		return armies;
	}

	@Override
	public MoveType getType() 
	{
		return MoveType.PLAY_CARDS;
	}

}
