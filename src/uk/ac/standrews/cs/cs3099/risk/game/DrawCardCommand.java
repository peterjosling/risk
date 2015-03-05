package uk.ac.standrews.cs.cs3099.risk.game;

public class DrawCardCommand extends Command {
	
	public DrawCardCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}
	
	@Override
	public CommandType getType()
	{
		return CommandType.TRADE_IN_CARDS;
	}
}
