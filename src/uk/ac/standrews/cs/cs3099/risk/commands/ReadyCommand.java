package uk.ac.standrews.cs.cs3099.risk.commands;

public class ReadyCommand extends Command {

	public ReadyCommand(int playerId, int ackId) 
	{
		super(playerId, ackId);
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.READY;
	}
}
