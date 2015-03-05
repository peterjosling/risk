package uk.ac.standrews.cs.cs3099.risk.game;

public class RollHashCommand extends Command {

	String hash;

	public RollHashCommand(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollHashCommand(int playerId, int ackId, String hash) {
		this(playerId, ackId);
		this.hash = hash;
	}

	@Override
	public CommandType getType() {
		return CommandType.ROLL_HASH;
	}

	public String getHash() {
		return hash;
	}
}
