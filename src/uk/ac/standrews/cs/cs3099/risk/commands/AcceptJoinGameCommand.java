package uk.ac.standrews.cs.cs3099.risk.commands;

public class AcceptJoinGameCommand extends Command {
	private String command = "accept_join_game";
	private AcceptJoinPayload payload = new AcceptJoinPayload();

	public AcceptJoinGameCommand(int playerId, int ackTimeout, int commandTimeout)
	{
		super(-1);
		this.payload.acknowledgementTimeout = ackTimeout;
		this.payload.commandTimeout = commandTimeout;
		this.payload.player_id = playerId;
	}

	public int getAcknowledgementTimeout()
	{
		return payload.acknowledgementTimeout;
	}

	public int getCommandTimeout()
	{
		return payload.commandTimeout;
	}

	public int getPlayerId()
	{
		return payload.player_id;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.ACCEPT_JOIN_GAME;
	}

	private class AcceptJoinPayload {
		int acknowledgementTimeout;
		int commandTimeout;
		int player_id;
	}
}
