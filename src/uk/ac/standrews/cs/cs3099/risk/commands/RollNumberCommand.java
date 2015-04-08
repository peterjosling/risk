package uk.ac.standrews.cs.cs3099.risk.commands;

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
	public CommandType getType() {
		return CommandType.ROLL_NUMBER;
	}
}
