package uk.ac.standrews.cs.cs3099.risk.ui;

import com.google.gson.Gson;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import uk.ac.standrews.cs.cs3099.risk.commands.ServerConnectCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.ServerStartCommand;
import uk.ac.standrews.cs.cs3099.risk.game.AbstractGame;
import uk.ac.standrews.cs.cs3099.risk.network.NetworkedGame;
import uk.ac.standrews.cs.cs3099.risk.game.Player;
import uk.ac.standrews.cs.cs3099.risk.game.UIPlayer;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

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
	}

	@Override
	public void onMessage(WebSocket webSocket, String s)
	{
		Map message = new Gson().fromJson(s, Map.class);
		String command = (String) message.get("command");

		if (command.equals("server_connect")) {
			connectToServer(webSocket, s);
		} else if (command.equals("server_start")) {
			startServer(webSocket, s);
		} else {
			// TODO Parse command, push onto player's queue.
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
	 * @param messageString
	 */
	private void connectToServer(WebSocket ws, String messageString)
	{
		ServerConnectCommand command = new Gson().fromJson(messageString, ServerConnectCommand.class);
		NetworkedGame game = new NetworkedGame(24);
		Player player = new UIPlayer(ws, 0, "Test player");
		games.put(ws.getRemoteSocketAddress(), game);
	}

	/**
	 * Create a new NetworkedGame and host a server
	 *
	 * @param ws
	 * @param messageString
	 */
	private void startServer(WebSocket ws, String messageString)
	{
		ServerStartCommand command = new Gson().fromJson(messageString, ServerStartCommand.class);
		AbstractGame game = new NetworkedGame(24);
		Player player = new UIPlayer(ws, 0, "Test player");
		games.put(ws.getRemoteSocketAddress(), game);
	}
}
