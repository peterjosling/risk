package uk.ac.standrews.cs.cs3099.risk.game;

public class RollNumberCommand extends Command {

	String rollNumberHex;

	public RollNumberCommand(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollNumberCommand(int playerId, int ackId, String rollNumberHex) {
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
