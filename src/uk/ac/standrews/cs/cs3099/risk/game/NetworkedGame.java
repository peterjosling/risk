package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.network.ConnectionManager;

import java.io.IOException;

public class NetworkedGame extends AbstractGame {
	private ConnectionManager connectionManager;

	public NetworkedGame(int armiesPerPlayer)
	{
		super(armiesPerPlayer);
	}

	/**
	 * Start a new host server.
	 *
	 * @param port The port to listen on for incoming connections.
	 * @throws IOException
	 */
	public void startServer(int port) throws IOException
	{
		if (connectionManager != null) {
			return;
		}

		connectionManager = new ConnectionManager(port);
	}

	/**
	 * Connect to an existing host server.
	 *
	 * @param hostname The hostname of the server to connect to.
	 * @param port     The port to connect on.
	 * @throws IOException
	 */
	public void connectToServer(String hostname, int port) throws IOException
	{
		if (connectionManager != null) {
			return;
		}

		connectionManager = new ConnectionManager(hostname, port);
	}
}
