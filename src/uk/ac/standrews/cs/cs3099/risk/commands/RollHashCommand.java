package uk.ac.standrews.cs.cs3099.risk.commands;

public class RollHashCommand extends Command {
	private String command = "roll_hash";
	String payload;

	public RollHashCommand(int playerId) {
		super(playerId);
	}

	public RollHashCommand(int playerId, String hash) {
		this(playerId);
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
