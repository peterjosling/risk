package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;

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
		while (true) {
			try {
				String commandString = reader.readLine();
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

