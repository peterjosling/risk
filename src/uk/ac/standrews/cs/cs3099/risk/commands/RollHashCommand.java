package uk.ac.standrews.cs.cs3099.risk.commands;

public class RollHashCommand extends Command {
	private String command = "roll_hash";
	String payload;

	public RollHashCommand(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollHashCommand(int playerId, int ackId, String hash) {
		this(playerId, ackId);
		this.payload = hash;
	}

	@Override
	public CommandType getType() {
		return CommandType.ROLL_HASH;
	}

	public String getHash() {
		return payload;
	}
}
