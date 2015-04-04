package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.game.AbstractGame;
import uk.ac.standrews.cs.cs3099.risk.game.NetworkPlayer;
import uk.ac.standrews.cs.cs3099.risk.game.Player;

import java.io.IOException;

public class NetworkedGame extends AbstractGame {
	private ConnectionManager connectionManager;
	private Player localPlayer;
	private int moveTimeout;
	private int acknowledgementTimeout;

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
		// TODO ensure move/ack timeouts are set.

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

			case PLAYERS_JOINED:
				playersJoined((PlayersJoinedCommand) command);
				return;

			case PING:
				playerPinged((PingCommand) command);
				return;

			case READY:
				readyReceived((ReadyCommand) command);
				return;
		}

		// Send acknowledgement.
		int ackId = command.getAckId();

		if (ackId != -1 && command.getType() != CommandType.ACKNOWLEDGEMENT) {
			sendAcknowledgement(ackId);
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
		// TODO check if we have max number of players, issue a "ping" command.
	}

	/**
	 * Called when accepted to join a hosted game.
	 *
	 * @param command Player details in the connected game.
	 */
	private void joinAccepted(AcceptJoinGameCommand command)
	{
		// Update game/player state from response.
		acknowledgementTimeout = command.getAcknowledgementTimeout();
		moveTimeout = command.getCommandTimeout();
		localPlayer.setId(command.getPlayerId());

		// Notify the local player, so UI can be updated.
		localPlayer.notifyCommand(command);
	}

	/**
	 * Called when rejected attempting to join a hosted game.
	 *
	 * @param command Details of the rejection.
	 */
	private void joinRejected(RejectJoinGameCommand command)
	{
		localPlayer.notifyCommand(command);
		// TODO disconnect.
	}

	/**
	 * Forwards details of new players joining the game to the local player.
	 */
	private void playersJoined(PlayersJoinedCommand command)
	{
		// Allow the local player to update any UI.
		localPlayer.notifyCommand(command);

		// Add new players to the game.
		PlayersJoinedCommand.PlayersNames[] playerNames = command.getPlayerNames();

		for (PlayersJoinedCommand.PlayersNames playerDetails : playerNames) {
			int playerId = playerDetails.getPlayerId();
			String name = playerDetails.getPlayerName();
			// TODO store public key on player.
			Player player = new NetworkPlayer(connectionManager, playerId, name);
			addPlayer(player);
		}
	}

	/**
	 * Track players responding with pings, and reply to the first ping issued
	 * @param command Command detailing the player issuing the ping.
	 */
	private void playerPinged(PingCommand command)
	{
		localPlayer.notifyCommand(command);

		// If this ping is from the host, respond.
		if (command.getNoOfPlayers() > 0) {
			PingCommand response = new PingCommand(localPlayer.getId());
			connectionManager.sendCommand(response);
		}
	}

	private void readyReceived(ReadyCommand command)
	{
		localPlayer.notifyCommand(command);
		sendAcknowledgement(command.getAckId());
	}

	private void sendAcknowledgement(int ackId)
	{
		// Non-playing hosts don't need to ack.
		if (localPlayer == null) {
			return;
		}

		AcknowledgementCommand ack = new AcknowledgementCommand(localPlayer.getId(), ackId);
		connectionManager.sendCommand(ack);
	}
}
