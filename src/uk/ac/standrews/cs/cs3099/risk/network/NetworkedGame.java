package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.game.AbstractGame;
import uk.ac.standrews.cs.cs3099.risk.game.Player;

import java.io.IOException;

public class NetworkedGame extends AbstractGame {
	private ConnectionManager connectionManager;
	private Player localPlayer;

	private final float[] SUPPORTED_VERSIONS = new float[]{1};
	private final String[] SUPPORTED_FEATURES = new String[]{};

	public NetworkedGame(int armiesPerPlayer)
	{
		super(armiesPerPlayer);
	}

	/**
	 * Start a new host server.
	 *
	 * @param port The port to listen on for incoming connections.
	 * @throws IOException
	 */
	public void startServer(int port) throws IOException
	{
		if (connectionManager != null) {
			return;
		}

		connectionManager = new ConnectionManager(this, port);
	}

	/**
	 * Connect to an existing host server.
	 *
	 * @param hostname The hostname of the server to connect to.
	 * @param port     The port to connect on.
	 * @throws IOException
	 */
	public void connectToServer(String hostname, int port) throws IOException
	{
		if (connectionManager != null) {
			return;
		}

		JoinGameCommand joinGameCommand = new JoinGameCommand(SUPPORTED_VERSIONS, SUPPORTED_FEATURES);
		connectionManager = new ConnectionManager(this, hostname, port);
		connectionManager.sendCommand(joinGameCommand);
	}

	/**
	 * Add a Player instance to the game. In a client, will request to join. In a server, will receive all join
	 * requests. May only be called once for the Game instance.
	 *
	 * @param player The player to add to the game
	 */
	public void setLocalPlayer(Player player)
	{
		if (localPlayer != null) {
			return;
		}

		localPlayer = player;
	}

	/**
	 * Called by the {@link ConnectionManager} instance when a command is received from the network.
	 *
	 * @param command The command received from a player or the host.
	 */
	protected void messageReceived(Command command)
	{
		// Handle commands which don't come from an individual player.
		switch (command.getType()) {
			case JOIN_GAME:
				playerJoinRequested((JoinGameCommand) command);
				return;

			case ACCEPT_JOIN_GAME:
				joinAccepted((AcceptJoinGameCommand) command);
				return;

			case REJECT_JOIN_GAME:
				joinRejected((RejectJoinGameCommand) command);
				return;
		}

		// TODO Add to correct player's move queue based on player_id field.
	}

	/**
	 * Called when a player requests to join the game, when running as a host.
	 *
	 * @param command Command with details of the player requesting to join the game.
	 */
	private void playerJoinRequested(JoinGameCommand command)
	{
		// Automatically accept players up until the limit.
		// TODO forward this command to UIPlayers and get a response.
		// TODO accept player.
	}

	/**
	 * Called when accepted to join a hosted game.
	 *
	 * @param command Player details in the connected game.
	 */
	private void joinAccepted(AcceptJoinGameCommand command)
	{
		// TODO notify player.
	}

	/**
	 * Called when rejected attempting to join a hosted game.
	 *
	 * @param command Details of the rejection.
	 */
	private void joinRejected(RejectJoinGameCommand command)
	{
		// TODO notify player.
		// TODO disconnect.
	}
}
