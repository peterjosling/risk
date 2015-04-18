package uk.ac.standrews.cs.cs3099.risk.commands;

public class LeaveGameCommand extends Command {
	private String command = "leave_game";
	private LeaveGamePayload payload = new LeaveGamePayload();

	public LeaveGameCommand(int playerId, int ackId, int response, String message, boolean receiveUpdates)
	{
		super(playerId, ackId);
		payload.response = response;
		payload.message = message;
		payload.receiveUpdates = receiveUpdates;
	}

	public int getResponse() 
	{
		return payload.response;
	}

	public boolean isReceiveUpdates() 
	{
		return payload.receiveUpdates;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.LEAVE_GAME;
	}

	private class LeaveGamePayload {
		int response;
		String message;
		boolean receiveUpdates;
	}
}
