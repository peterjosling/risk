package uk.ac.standrews.cs.cs3099.risk.ui;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.ServerConnectCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.ServerStartCommand;
import uk.ac.standrews.cs.cs3099.risk.game.Player;
import uk.ac.standrews.cs.cs3099.risk.game.UIPlayer;
import uk.ac.standrews.cs.cs3099.risk.network.ConnectionManager;
import uk.ac.standrews.cs.cs3099.risk.network.HostServer;
import uk.ac.standrews.cs.cs3099.risk.network.NetworkedGame;
import uk.ac.standrews.cs.cs3099.risk.network.PlayerSocket;

import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;

public class WebSocketServer extends org.java_websocket.server.WebSocketServer {
	HashMap<InetSocketAddress, NetworkedGame> games = new HashMap<InetSocketAddress, NetworkedGame>();

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

		// terminate game
		NetworkedGame game = games.get(webSocket.getRemoteSocketAddress());
		ConnectionManager cm = game.getConnectionManager();
		if (cm.isServer()) {
			for (int playerId = 0; playerId < 6; playerId++) {
				PlayerSocket playerSocket = cm.getSocketById(playerId);
				if (playerSocket != null) {
					playerSocket.disconnect();
					cm.removePlayerSocket(playerSocket);
				}
			}
			HostServer hostServer = cm.getHostServer();
			hostServer.terminate();
		} else {
			// terminate host connection
			ArrayList<PlayerSocket> playerSockets = cm.getPlayerSockets();
			playerSockets.get(0).disconnect();
			playerSockets.remove(0);

		}
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

		// add ack_id value, if required.

		// Add the move to the local player's queue.
		NetworkedGame game = games.get(webSocket.getRemoteSocketAddress());
		CommandType type = command.getType();
		if (type != CommandType.ACCEPT_JOIN_GAME && type != CommandType.JOIN_GAME &&
				type != CommandType.REJECT_JOIN_GAME && type != CommandType.PING && type != CommandType.ACKNOWLEDGEMENT &&
				type != CommandType.ROLL_HASH && type != CommandType.ROLL_NUMBER) {

			int ackId = game.nextAckId();
			command.setAckId(ackId);
		}

		Player player = game.getLocalPlayer();

		if (player != null && player instanceof UIPlayer) {
			((UIPlayer) player).queueCommand(command);
		}
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
		NetworkedGame game = new NetworkedGame();

		Player player;

		if (command.useAi()) {
			String name = "Test AI Player";
			player = new UIAIPlayer(ws, 0, name, new AIPlayer(0, name));
		} else {
			player = new UIPlayer(ws, 0, "Test player");
		}

		game.setLocalPlayer(player);
		games.put(ws.getRemoteSocketAddress(), game);

		NetworkedGameThread networkedGameThread = new NetworkedGameThread(game, command.getHostname(), command.getPort());
		new Thread(networkedGameThread).start();
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
		NetworkedGame game = new NetworkedGame();
		game.setLocalPlayer(player);
		games.put(ws.getRemoteSocketAddress(), game);

		NetworkedGameThread networkedGameThread = new NetworkedGameThread(game, command.getPort());
		new Thread(networkedGameThread).start();
	}
}
