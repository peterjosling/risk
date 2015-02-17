package uk.ac.standrews.cs.cs3099.risk.game;

public class RollHashMove extends Move{

	String hash;

	public RollHashMove(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollHashMove(int playerId, int ackId, String hash) {
		this(playerId, ackId);
		this.hash = hash;
	}

	@Override
	public MoveType getType() {
		return MoveType.ROLL_HASH;
	}

	public String getHash() {
		return hash;
	}
}
