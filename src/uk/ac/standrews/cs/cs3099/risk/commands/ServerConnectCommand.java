package uk.ac.standrews.cs.cs3099.risk.commands;

/**
 * Move to represent the server_connect command. Used only for the internal frontend server.
 */
public class ServerConnectCommand extends Command {
	private String command = "server_connect";
	private ServerConnectPayload payload;

	public ServerConnectCommand(int playerId)
	{
		super(playerId);
	}

	public String getHostname()
	{
		return this.payload.hostname;
	}

	public int getPort()
	{
		return this.payload.port;
	}

	public boolean useAi() {
		return payload.ai;
	}

	public String getName() {
		return payload.name;
	}

	@Override
	public CommandType getType()
	{
		return CommandType.SERVER_CONNECT;
	}

	private class ServerConnectPayload {
		String name;
		String hostname;
		int port;
		boolean ai;
	}
}
