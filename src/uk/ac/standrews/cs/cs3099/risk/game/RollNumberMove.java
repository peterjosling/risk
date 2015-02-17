package uk.ac.standrews.cs.cs3099.risk.game;

public class RollNumberMove extends Move{

	String rollNumberHex;

	public RollNumberMove(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollNumberMove(int playerId, int ackId, String rollNumberHex) {
		this(playerId, ackId);
		this.rollNumberHex = rollNumberHex;
	}

	public String getRollNumberHex() {
		return rollNumberHex;
	}

	@Override
	public MoveType getType() {
		return MoveType.ROLL_NUMBER;
	}
}
