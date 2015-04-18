package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class ConnectionManager {
	private final boolean isServer;
	private final ArrayList<PlayerSocket> playerSockets = new ArrayList<PlayerSocket>();

	private NetworkedGame game;

	/**
	 * Create a new server instance, listening on the specified port.
	 *
	 * @param port The port to listen for incoming connections.
	 */
	public ConnectionManager(NetworkedGame game, int port) throws IOException
	{
		this.game = game;
		this.isServer = true;
		ServerSocket socket = new ServerSocket(port);
		HostServer hostServer = new HostServer(this, socket);
		new Thread(hostServer).start();
	}

	/**
	 * Create a new host instance, connecting to the specified host:port.
	 *
	 * @param hostname The hostname of the server to connect to.
	 * @param port     The port to connect on.
	 */
	public ConnectionManager(NetworkedGame game, String hostname, int port) throws IOException
	{
		this.game = game;
		this.isServer = false;
		Socket socket = new Socket(hostname, port);

		PlayerSocket playerSocket = new PlayerSocket(game, socket);
		playerSockets.add(playerSocket);
		new Thread(playerSocket).start();
	}

	/**
	 * Send the specified command to all connected clients (either a single host for forwarding, or all clients).
	 *
	 * @param command The command to send.
	 */
	public void sendCommand(Command command)
	{
		System.out.println("Sending command: " + command.toJSON());

		for (PlayerSocket playerSocket : playerSockets) {
			playerSocket.sendCommand(command);
		}
	}

	/**
	 * Called by the {@link HostServer} instance when a new client connects to this host.
	 *
	 * @param socket The client socket for the newly connected client.
	 */
	protected void clientConnected(Socket socket)
	{
		try {
			PlayerSocket playerSocket = new PlayerSocket(game, socket);
			playerSockets.add(playerSocket);
			new Thread(playerSocket).start();
		} catch (IOException e) {
			System.err.println("Failed to process new client socket.");
			e.printStackTrace();
		}
	}

	public boolean isServer() {
		return isServer;
	}
}
