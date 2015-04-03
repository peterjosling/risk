package uk.ac.standrews.cs.cs3099.risk.network;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

public class PlayerSocket implements Runnable {
	private final NetworkedGame game;
	private final BufferedReader reader;

	public PlayerSocket(NetworkedGame game, Socket socket) throws IOException
	{
		this.game = game;
		reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
	}

	@Override
	public void run()
	{
		try {
			String commandString = reader.readLine();
			// TODO parse JSON
			game.messageReceived(null);
		} catch (IOException e) {
			System.err.println("Failed to read from client socket.");
			e.printStackTrace();
		}
	}
}

