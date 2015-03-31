package uk.ac.standrews.cs.cs3099.risk.network;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class ConnectionManager {
	private final boolean isServer;
	private final ArrayList<Socket> sockets = new ArrayList<Socket>();

	/**
	 * Create a new server instance, listening on the specified port.
	 *
	 * @param port The port to listen for incoming connections.
	 */
	public ConnectionManager(int port) throws IOException
	{
		this.isServer = true;
		ServerSocket socket = new ServerSocket(port);
	}

	/**
	 * Create a new host instance, connecting to the specified host:port.
	 *
	 * @param hostname The hostname of the server to connect to.
	 * @param port     The port to connect on.
	 */
	public ConnectionManager(String hostname, int port) throws IOException
	{
		this.isServer = false;
		Socket socket = new Socket(hostname, port);
		sockets.add(socket);
	}
}
