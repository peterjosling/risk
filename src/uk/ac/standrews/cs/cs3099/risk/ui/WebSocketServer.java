package uk.ac.standrews.cs.cs3099.risk.ui;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.ServerConnectCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.ServerStartCommand;
import uk.ac.standrews.cs.cs3099.risk.game.AbstractGame;
import uk.ac.standrews.cs.cs3099.risk.game.Player;
import uk.ac.standrews.cs.cs3099.risk.game.UIPlayer;
import uk.ac.standrews.cs.cs3099.risk.network.NetworkedGame;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.HashMap;

public class WebSocketServer extends org.java_websocket.server.WebSocketServer {
	HashMap<InetSocketAddress, AbstractGame> games = new HashMap<InetSocketAddress, AbstractGame>();

	public WebSocketServer(InetSocketAddress address)
	{
		super(address);
	}

	@Override
	public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake)
	{
		System.out.println("New client connected: " + webSocket);
	}

	@Override
	public void onClose(WebSocket webSocket, int i, String s, boolean b)
	{
		System.out.println("Client disconnected: " + webSocket);

		// TODO terminate game.
	}

	@Override
	public void onMessage(WebSocket webSocket, String s)
	{
		System.out.println("WebSocket message received: " + s);
		Command command = Command.fromJSON(s);

		if (command == null) {
			System.out.println("Invalid command received from websocket.");
			return;
		}

		System.out.println("Command: " + command.getType());

		switch (command.getType()) {
			case SERVER_CONNECT:
				connectToServer(webSocket, (ServerConnectCommand) command);
				return;

			case SERVER_START:
				startServer(webSocket, (ServerStartCommand) command);
				return;
		}

		// TODO Parse command, push onto player's queue.
	}

	@Override
	public void onError(WebSocket webSocket, Exception e)
	{

	}

	/**
	 * Create a new NetworkedGame and connect to the specified server
	 *
	 * @param ws
	 * @param command
	 */
	private void connectToServer(WebSocket ws, ServerConnectCommand command)
	{
		System.out.println("Connecting");
		NetworkedGame game = new NetworkedGame(24);
		Player player = new UIPlayer(ws, 0, "Test player");
		game.setLocalPlayer(player);
		games.put(ws.getRemoteSocketAddress(), game);

		try {
			game.connectToServer(command.getHostname(), command.getPort());
		} catch (IOException e) {
			System.err.println("Failed to connect to remote host.");
		}
	}

	/**
	 * Create a new NetworkedGame and host a server
	 *
	 * @param ws
	 * @param command
	 */
	private void startServer(WebSocket ws, ServerStartCommand command)
	{
		Player player = new UIPlayer(ws, 0, "Player names not implemented");
		NetworkedGame game = new NetworkedGame(24);
		game.setLocalPlayer(player);
		games.put(ws.getRemoteSocketAddress(), game);

		try {
			game.startServer(command.getPort());
		} catch (IOException e) {
			System.err.println("Couldn't start host server on port " + command.getPort());
		}
	}
}
