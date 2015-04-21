package uk.ac.standrews.cs.cs3099.risk.network;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class HostServer implements Runnable {
	private ConnectionManager connectionManager;
	private ServerSocket serverSocket;

	public HostServer(ConnectionManager connectionManager, ServerSocket serverSocket)
	{
		this.connectionManager = connectionManager;
		this.serverSocket = serverSocket;
	}

	@Override
	public void run()
	{
		while (!serverSocket.isClosed()) {
			try {
				Socket socket = serverSocket.accept();
				connectionManager.clientConnected(socket);
			} catch (IOException e) {
				System.out.println("Failed to accept new client connection.");
			}
		}
	}

	/**
	 * Closes the serverSocket
	 */
	public void terminate(){
		try {
			serverSocket.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
