package uk.ac.standrews.cs.cs3099.risk.commands;

public class RollNumberCommand extends Command {
	private String command = "roll_number";
	String payload;

	public RollNumberCommand(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollNumberCommand(int playerId, int ackId, String rollNumberHex) {
		this(playerId, ackId);
		this.payload = rollNumberHex;
	}

	public String getRollNumberHex() {
		return payload;
	}

	@Override
	public CommandType getType() {
		return CommandType.ROLL_NUMBER;
	}
}
