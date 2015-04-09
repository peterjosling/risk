package uk.ac.standrews.cs.cs3099.risk.commands;

/**
 * Move to represent the server_start command. Used only for the internal frontend server.
 */
public class ServerStartCommand extends Command {
	private String command = "server_start";
	private ServerStartPayload payload;

	public ServerStartCommand(int playerId)
	{
		super(playerId);
	}

	public int getPort()
	{
		return payload.port;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.SERVER_START;
	}

	private class ServerStartPayload {
		int port;
	}
}
