package uk.ac.standrews.cs.cs3099.risk.commands;

public class RejectJoinGameCommand extends Command {
	private String command = "reject_join_game";
	private String payload;

	public RejectJoinGameCommand(String errorMessage)
	{
		super();
		this.payload = errorMessage;
	}

	public String getErrorMessage()
	{
		return payload;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.REJECT_JOIN_GAME;
	}
}
