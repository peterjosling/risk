package uk.ac.standrews.cs.cs3099.risk.commands;

public class LeaveGameCommand extends Command {
	private int response;
	private boolean receiveUpdates;

	public LeaveGameCommand(int playerId, int ackId, int response,
			boolean receiveUpdates) 
	{
		super(playerId, ackId);
		this.response = response;
		this.receiveUpdates = receiveUpdates;
	}

	public int getResponse() 
	{
		return response;
	}

	public boolean isReceiveUpdates() 
	{
		return receiveUpdates;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.LEAVE_GAME;
	}
}
