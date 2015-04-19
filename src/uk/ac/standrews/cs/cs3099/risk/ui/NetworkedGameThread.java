package uk.ac.standrews.cs.cs3099.risk.ui;

import uk.ac.standrews.cs.cs3099.risk.network.NetworkedGame;

import java.io.IOException;

public class NetworkedGameThread implements Runnable {
	private NetworkedGame game;
	private String hostname;
	private int port;

	public NetworkedGameThread(NetworkedGame game, String hostname, int port)
	{
		this(game, port);
		this.hostname = hostname;
	}

	public NetworkedGameThread(NetworkedGame game, int port)
	{
		this.game = game;
		this.port = port;
	}

	@Override
	public void run()
	{
		if (hostname == null) {
			try {
				game.startServer(port);
			} catch (IOException e) {
				System.err.println("Couldn't start host server on port " + port);
			}
		} else {
			try {
				game.connectToServer(hostname, port);
			} catch (IOException e) {
				System.err.println("Failed to connect to remote host.");
			}
		}
	}
}
