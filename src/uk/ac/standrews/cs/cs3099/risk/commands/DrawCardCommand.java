package uk.ac.standrews.cs.cs3099.risk.commands;

public class DrawCardCommand extends Command {
	
	public DrawCardCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}
	
	@Override
	public CommandType getType()
	{
		return CommandType.DRAW_CARD;
	}
}
