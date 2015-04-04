package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

public class PlayerSocket implements Runnable {
	private final NetworkedGame game;
	private final Socket socket;
	private final BufferedReader reader;

	public PlayerSocket(NetworkedGame game, Socket socket) throws IOException
	{
		this.game = game;
		this.socket = socket;
		reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
	}

	@Override
	public void run()
	{
		while (!socket.isClosed()) {
			try {
				String commandString = reader.readLine();
				System.out.println("Message received: " + commandString);

				if (commandString == null) {
					System.out.println("Client socket closed.");
					Thread.currentThread().interrupt();
					return;
				}

				Command command = Command.fromJSON(commandString);

				if (command == null) {
					System.out.println("Invalid command received from player: " + commandString);
					continue;
				}

				game.messageReceived(command);
			} catch (IOException e) {
				System.err.println("Failed to read from client socket.");
				e.printStackTrace();
			}
		}
	}
}

