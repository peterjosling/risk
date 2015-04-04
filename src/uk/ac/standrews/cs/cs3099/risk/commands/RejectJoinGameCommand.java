package uk.ac.standrews.cs.cs3099.risk.commands;

public class RejectJoinGameCommand extends Command {
	private String errorMessage;

	public RejectJoinGameCommand(String errorMessage)
	{
		super();
		this.errorMessage = errorMessage;
	}
	
	public String getErrorMessage()
	{
		return errorMessage;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.REJECT_JOIN_GAME;
	}
}
