package uk.ac.standrews.cs.cs3099.risk.commands;

public class RollResultCommand extends Command {
	private String command = "roll_result";
	private int payload;

	public RollResultCommand(int payload)
	{
		this.payload = payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.ROLL_RESULT;
	}
}
