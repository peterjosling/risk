package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.game.AbstractGame;
import uk.ac.standrews.cs.cs3099.risk.game.NetworkPlayer;
import uk.ac.standrews.cs.cs3099.risk.game.Player;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.BlockingQueue;

public class NetworkedGame extends AbstractGame {
	private ConnectionManager connectionManager;
	private Player localPlayer;
	private int moveTimeout;
	private int acknowledgementTimeout;
	private Date timePingSent;
	private boolean gameInProgress;
	private String[] turnRollHashes;
	private String[] turnRollNumbers;
	private int numberOfPingsReceived = 0;
	private int ackId = 0;
	private ArrayList<Acknowledgement> acknowledgements = new ArrayList<Acknowledgement>();

	private final float[] SUPPORTED_VERSIONS = new float[]{1};
	private final String[] SUPPORTED_FEATURES = new String[]{};

	public NetworkedGame(int armiesPerPlayer)
	{
		super(armiesPerPlayer);
		//TODO stop catching exceptions everywhere
	}

	/**
	 * Start a new host server.
	 *
	 * @param port The port to listen on for incoming connections.
	 * @throws IOException
	 */
	public void startServer(int port) throws IOException
	{
		moveTimeout = 30;
		acknowledgementTimeout = 2;

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
		addPlayer(player);
	}

	public int getMoveTimeout()
	{
		return moveTimeout;
	}

	public int getAcknowledgementTimeout()
	{
		return acknowledgementTimeout;
	}

	protected int getNumberOfPingsReceived()
	{
		return numberOfPingsReceived;
	}

	/**
	 * Called by the {@link ConnectionManager} instance when a command is received from the network.
	 *
	 * @param command The command received from a player or the host.
	 */
	protected void messageReceived(Command command, PlayerSocket playerSocket)
	{
		// Handle commands which don't come from an individual player.
		switch (command.getType()) {
			case JOIN_GAME:
				playerJoinRequested((JoinGameCommand) command, playerSocket);
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

			case INITIALISE_GAME:
				initialiseGameCommand((InitialiseGameCommand) command);
				return;

			case ROLL_HASH:
				rollHashCommand((RollHashCommand) command);
				return;

			case ROLL_NUMBER:
				rollNumberCommand((RollNumberCommand) command);
				return;

			case ACKNOWLEDGEMENT:
				acknowledgementReceived((AcknowledgementCommand) command);
				break;
		}

		// Send acknowledgement.
		int ackId = command.getAckId();

		if (ackId != -1 && command.getType() != CommandType.ACKNOWLEDGEMENT) {
			sendAcknowledgement(ackId);
		}

		// TODO Add to correct player's move queue based on player_id field.
		NetworkPlayer player = (NetworkPlayer) getPlayerById(command.getPlayerId());
		BlockingQueue moveQueue = player.getMoveQueue();
		moveQueue.add(command);

		// TODO forward to all players, if host.
		if(connectionManager.isServer()){
			connectionManager.sendCommand(command);
		}

	}

	/**
	 * Called when a player requests to join the game, when running as a host.
	 *
	 * @param joinCommand  Command with details of the player requesting to join the game.
	 * @param playerSocket The PlayerSocket instance of the connecting player.
	 */
	private void playerJoinRequested(JoinGameCommand joinCommand, PlayerSocket playerSocket)
	{
		List<Player> players = getPlayers();

		// TODO get a response from the UIPlayer.
		if (!gameInProgress) {

			localPlayer.notifyCommand(joinCommand);

			// Automatically accept players up until the limit.
			Command command;
			int id = players.size();
			String name = joinCommand.getName();
			boolean accepted = false;

			if (id > 5) {
				command = new RejectJoinGameCommand("Game full");
			} else {
				command = new AcceptJoinGameCommand(id, acknowledgementTimeout, moveTimeout);
				NetworkPlayer player = new NetworkPlayer(connectionManager, id, name);
				addPlayer(player);
				accepted = true;
			}

			playerSocket.sendCommand(command);

			// Send PlayersJoinedCommands.
			if (accepted) {
				PlayersJoinedCommand newPlayerJoinedCommand = new PlayersJoinedCommand();
				newPlayerJoinedCommand.addPlayer(id, name);

				// TODO send to all players except {player}
				connectionManager.sendCommand(newPlayerJoinedCommand);

				PlayersJoinedCommand currentPlayers = new PlayersJoinedCommand();

				for (Player player : players) {
					if (player.getId() != id) {
						currentPlayers.addPlayer(player.getId(), player.getName());
					}
				}

				playerSocket.sendCommand(currentPlayers);
			}

			// Issue the ping command if we've reached the maximum number of players.
			if (id == 5 && accepted) {
				int playerId = (localPlayer != null) ? localPlayer.getId() : -1;
				PingCommand pingCommand = new PingCommand(playerId, players.size());
				timePingSent = new Date();
				connectionManager.sendCommand(pingCommand);

				// Create a new thread to wait until the timeout, and continue if necessary.
				PingTimeout pingTimeout = new PingTimeout(this);
				new Thread(pingTimeout).start();
			}
		} else {
			Command rejectCommand = new RejectJoinGameCommand("Game in progress");
			playerSocket.sendCommand(rejectCommand);
		}
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
	 *
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

		//if host check that all pings received, then send ReadyCommand,
		// wait for all acknowledgements, then send initialise game
		if (connectionManager.isServer()) {
			numberOfPingsReceived++;

			// Work out how many players we have in total
			int playerCount = numberOfPingsReceived;

			if (localPlayer != null) {
				playerCount++;
			}

			// Send ready immediately if we have all pings.
			if (playerCount == getPlayers().size()) {
				sendReadyCommand();
			}
		}
	}

	protected void sendReadyCommand()
	{
		int playerId = (localPlayer != null) ? localPlayer.getId() : -1;
		ReadyCommand readyCommand = new ReadyCommand(playerId, nextAckId());
		connectionManager.sendCommand(readyCommand);
		addAcknowledgement(readyCommand);

		// Wait until all acks have been received, then send the initialse command.
		ReadyAcknowledgementTimeout acknowledgementTimeout = new ReadyAcknowledgementTimeout(this, readyCommand.getAckId());
		new Thread(acknowledgementTimeout).start();
	}

	protected void sendInitialiseGameCommand()
	{
		// TODO check this is an intersection of compatible versions/features.
		Command initialiseGameCommand = new InitialiseGameCommand(1, new String[0]);
		connectionManager.sendCommand(initialiseGameCommand);
		addAcknowledgement(initialiseGameCommand);

		// TODO create a new thread which sleeps until {timeout}
	}

	/**
	 * Timeout players that haven't acknowledged the specified commands
	 *
	 * @param ackId the ackId of the command being checked for
	 */
	private void timeoutPlayersNotAcknowledged(int ackId)
	{
		boolean[] playersAcks = acknowledgements.get(ackId).getPlayersAcknowledged();
		List<Player> players = getPlayers();
		for (int i = 0; i < 6; i++) {
			if (!playersAcks[i] && !players.get(i).isNeutral()) {
				Command timeoutCommand = localPlayer.getCommand(CommandType.TIMEOUT);
				connectionManager.sendCommand(timeoutCommand);
				players.get(i).makeNeutral();
			}
		}
	}

	/**
	 * Checks whether timeout for ping has been reached
	 *
	 * @return true if timeout reached
	 */
	private boolean pingTimeoutReached()
	{
		Date currentTime = new Date();
		long timePassedMilliSeconds = currentTime.getTime() - timePingSent.getTime();
		int timePassedInSeconds = (int) timePassedMilliSeconds / 1000;
		if (timePassedInSeconds > moveTimeout) return true;
		return false;
	}

	/**
	 * Checks whether timeout for command given by ackId has been reached
	 *
	 * @param ackId the ackId of the command to check
	 * @return true if timeout reached, false if not
	 */
	private boolean timeoutReached(int ackId)
	{
		Acknowledgement acknowledgement = acknowledgements.get(ackId);
		Date timeCreated = acknowledgement.getTimeCreated();
		Date currentTime = new Date();
		long timePassedMilliSeconds = currentTime.getTime() - timeCreated.getTime();
		int timePassedInSeconds = (int) timePassedMilliSeconds / 1000;
		if (timePassedInSeconds > acknowledgementTimeout) return true;
		return false;
	}

	/**
	 * Adds an Acknowledgement to the list of acknowledgements for all commands that have been sent
	 *
	 * @param command - the new command created
	 */
	public void addAcknowledgement(Command command){
		int ackId = command.getAckId();

		Acknowledgement acknowledgement = new Acknowledgement(ackId);
		acknowledgements.add(ackId, acknowledgement);

		// Mark the sending player as having already acknowledged.
		int playerId = command.getPlayerId();

		if (playerId > -1) {
			Acknowledgement ack = acknowledgements.get(ackId);
			ack.getPlayersAcknowledged()[playerId] = true;
		}
	}

	/**
	 * checks whether an acknowledgement for a command given by ackId has been received for every player
	 *
	 * @param ackId the ackId of the command to check
	 * @return true if all received, false if not
	 */
	public boolean allAcknowledgementsReceived(int ackId)
	{
		boolean[] playersAcks = acknowledgements.get(ackId).getPlayersAcknowledged();
		List<Player> players = getPlayers();
		for (int i = 0; i < 6; i++) {
			if (!playersAcks[i] && !players.get(i).isNeutral()) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Let local player know what version/features the game is using, participate in player selection roll.
	 *
	 * @param command
	 */
	private void initialiseGameCommand(InitialiseGameCommand command)
	{
		localPlayer.notifyCommand(command);

		// Initialise the game state and load the map. Players list is finalised.
		init();

		String hash = "TODO_IMPLEMENT_HASH";
		RollHashCommand rollHashCommand = new RollHashCommand(localPlayer.getId(), hash);
		connectionManager.sendCommand(rollHashCommand);
	}

	private void readyReceived(ReadyCommand command)
	{
		localPlayer.notifyCommand(command);
		addAcknowledgement(command);
		sendAcknowledgement(command.getAckId());
	}

	/**
	 * Store the hash for the initial dice roll to select which player takes the first turn.
	 *
	 * @param command
	 */
	private void rollHashCommand(RollHashCommand command)
	{
		turnRollHashes[command.getPlayerId()] = command.getHash();

		// If we've received them all, send the roll number.
		boolean hashesReceived = true;

		for (String hash : turnRollNumbers) {
			hashesReceived = hashesReceived && hash.length() > 0;
		}

		if (hashesReceived) {
			RollNumberCommand rollNumberCommand = new RollNumberCommand(localPlayer.getId(), "TODO_IMPLEMENT_NUMBER");
			connectionManager.sendCommand(rollNumberCommand);
		}
	}

	/**
	 * Store the number for the initial dice roll from each player. Perform the roll if all numbers received.
	 *
	 * @param command
	 */
	private void rollNumberCommand(RollNumberCommand command)
	{
		turnRollNumbers[command.getPlayerId()] = command.getRollNumberHex();
		// TODO verify number/hash match.

		boolean rollsReceived = true;

		for (String number : turnRollNumbers) {
			rollsReceived = rollsReceived && number.length() > 0;
		}

		if (rollsReceived) {
			// TODO roll die, get first player.
		}
	}

	private void sendAcknowledgement(int ackId)
	{
		// Non-playing hosts don't need to ack.
		if (localPlayer == null) {
			return;
		}

		AcknowledgementCommand ack = new AcknowledgementCommand(localPlayer.getId(), ackId);
		connectionManager.sendCommand(ack);

		// Update value for next acknowledgement
		this.ackId = ackId + 1;
	}

	private void acknowledgementReceived(AcknowledgementCommand command)
	{
		Acknowledgement ack = acknowledgements.get(command.getAckId());
		ack.getPlayersAcknowledged()[command.getPlayerId()] = true;
		System.out.println("Ack received: player " + command.getPlayerId());
	}

	/**
	 * Get the acknowledgement ID for the next command, and increment it.
	 *
	 * @return
	 */
	private int nextAckId()
	{
		return ackId++;
	}
}
