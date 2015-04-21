package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.game.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Semaphore;

public class NetworkedGame extends AbstractGame {
	private ConnectionManager connectionManager;
	private Player localPlayer;
	private int moveTimeout;
	private int acknowledgementTimeout;
	private Date timePingSent;
	private boolean gameInProgress;
	private String[] initRollHashes = new String[6];
	private String[] initRollNumbers = new String[6];
	private boolean deckShuffled = false;
	private int numberOfPingsReceived = 0;
	private int ackId = 0;
	private Map<Integer, Acknowledgement> acknowledgements = new HashMap<Integer, Acknowledgement>();
	private float highestMutuallySupportedVersion;
	private Semaphore gameStart = new Semaphore(0);

	private Die die;
	private int firstplayer = -1;
	private int[] deckorder = new int[44];
	private boolean hasinit = false;
	/* private boolean senthash = false; */

	private final float[] SUPPORTED_VERSIONS = new float[]{1};
	private final String[] SUPPORTED_FEATURES = new String[]{};

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
		threadSafeRunGame();
	}

	/**
	 * Connect to an existing host server.
	 *
	 * @param hostname The hostname of the server to connect to.
	 * @param port     The port to connect on.
	 * @throws IOException
	 */
	public void connectToServer(String hostname, int port, String name) throws IOException
	{
		if (connectionManager != null) {
			return;
		}

		JoinGameCommand joinGameCommand = new JoinGameCommand(SUPPORTED_VERSIONS, SUPPORTED_FEATURES, name);
		connectionManager = new ConnectionManager(this, hostname, port);
		connectionManager.sendCommand(joinGameCommand);
		threadSafeRunGame();
	}

	public void threadSafeRunGame()
	{
		try {
			gameStart.acquire();
			run();
		} catch (InterruptedException e) {
			System.err.println("Failed to wait on game start.");
			System.exit(1);
		}
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

	/**
	 * Get the player local to this machine.
	 * @return A Player instance, or null if this is a non-playing host.
	 */
	public Player getLocalPlayer()
	{
		return localPlayer;
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
				joinRejected((RejectJoinGameCommand) command, playerSocket);
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

			// Handle RollHash and RollNumber commands only for the initial turn roll.
			case ROLL_HASH:
				if (getCurrentTurn() == -1 || !deckShuffled) {
					rollHashCommand((RollHashCommand) command);
					return;
				}
				break;

			case ROLL_NUMBER:
				if (getCurrentTurn() == -1 || !deckShuffled) {
					rollNumberCommand((RollNumberCommand) command);
					return;
				}
				break;

			case ACKNOWLEDGEMENT:
				acknowledgementReceived((AcknowledgementCommand) command);
				return;
		}

		// Add to correct player's move queue based on player_id field.
		NetworkPlayer player = (NetworkPlayer) getPlayerById(command.getPlayerId());
		BlockingQueue moveQueue = player.getMoveQueue();
		moveQueue.add(command);

		// forward to all players, if host.
		if (connectionManager.isServer()) {
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

		if (!gameInProgress) {

			localPlayer.notifyCommand(joinCommand);

			// TODO Use response from the UIPlayer.
			if (localPlayer instanceof UIPlayer) {
				localPlayer.getCommand(CommandType.ACCEPT_JOIN_GAME);
			}

			// Automatically accept players up until the limit.
			Command command;
			int id = players.size();
			String name = joinCommand.getName();
			float[] versions = joinCommand.getSupported_versions();
			boolean accepted = false;
			if(versions[0]!=1.0){
				command = new RejectJoinGameCommand("Must support version 1");
			}
			else if (id > 5) {
				command = new RejectJoinGameCommand("Game full");
			}
			else {
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

				PlayersJoinedCommand currentPlayers = new PlayersJoinedCommand();

				for (Player player : players) {
					if (player.getId() != id) {
						currentPlayers.addPlayer(player.getId(), player.getName());
						player.notifyCommand(newPlayerJoinedCommand);
					}
				}

				playerSocket.sendCommand(currentPlayers);
			}

			// Issue the ping command if we've reached the maximum number of players.
			if (id == 1 && accepted) {
				int playerId = (localPlayer != null) ? localPlayer.getId() : -1;
				PingCommand pingCommand = new PingCommand(playerId, players.size());
				timePingSent = new Date();
				connectionManager.sendCommand(pingCommand);

				if (localPlayer != null) {
					localPlayer.notifyCommand(pingCommand);
				}

				// If this is a playing host, mark it has having received this ping.
				if (playerId > -1) {
					numberOfPingsReceived++;
				}

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
	private void joinRejected(RejectJoinGameCommand command, PlayerSocket playerSocket)
	{
		localPlayer.notifyCommand(command);
		// disconnect.
		playerSocket.disconnect();
		connectionManager.removePlayerSocket(playerSocket);
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
		numberOfPingsReceived++;
		localPlayer.notifyCommand(command);

		// If this ping is from the host, respond.
		if (command.getNoOfPlayers() > 0) {
			PingCommand response = new PingCommand(localPlayer.getId());
			connectionManager.sendCommand(response);
		}

		Player player = getPlayerById(command.getPlayerId());
		player.setNeutral(false);

		// Send ready immediately if we have all pings.
		if (connectionManager.isServer() && numberOfPingsReceived == getPlayers().size()) {
			sendReadyCommand();
		}
	}

	protected void sendReadyCommand()
	{
		int playerId = (localPlayer != null) ? localPlayer.getId() : -1;
		ReadyCommand readyCommand = new ReadyCommand(playerId, nextAckId());
		connectionManager.sendCommand(readyCommand);

		// Wait until all acks have been received, then send the initialise command.
		ReadyAcknowledgementTimeout acknowledgementTimeout = new ReadyAcknowledgementTimeout(this, readyCommand.getAckId());
		new Thread(acknowledgementTimeout).start();
	}

	protected void sendInitialiseGameCommand()
	{
		// TODO check this is an intersection of compatible versions/features.
		InitialiseGameCommand initialiseGameCommand = new InitialiseGameCommand(1, new String[0]);
		connectionManager.sendCommand(initialiseGameCommand);
		initialiseGameCommand(initialiseGameCommand);
	}

	/**
	 * Timeout players that haven't acknowledged the specified commands
	 *
	 * @param ackId the ackId of the command being checked for
	 */
	public void timeoutPlayersNotAcknowledged(int ackId)
	{
		boolean[] playersAcks = acknowledgements.get(ackId).getPlayersAcknowledged();
		List<Player> players = getPlayers();
		for (int i = 0; i < players.size(); i++) {
			if (!playersAcks[i] && !players.get(i).isNeutral()) {
				players.get(i).setNeutral(true);
			}
		}
		Command timeoutCommand = localPlayer.getCommand(CommandType.TIMEOUT);
		connectionManager.sendCommand(timeoutCommand);
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
		acknowledgements.put(ackId, acknowledgement);
//		if(acknowledgements.get(ackId)!=)

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
		for (int i = 0; i < players.size(); i++) {
			if (!playersAcks[i] && !players.get(i).isNeutral()) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Called when a new dice roll is expected to reinitialise the die state and send the first hash
	 */
	synchronized private void startDieRoll()
	{
		if (!hasinit && localPlayer != null) {
			int id = localPlayer.getId();

			die = new Die();
			byte[] numb = die.generateNumber();
			String num = die.byteToHex(numb);
			String hash = die.byteToHex(die.hashByteArr(numb));

			initRollHashes = new String[6];
			initRollNumbers = new String[6];

			initRollHashes[id] = hash;
			initRollNumbers[id] = num;

			Logger.print("---------------------------" + id + " is sending HASH" + hash);
			Thread.dumpStack();
			RollHashCommand rollHashCommand = new RollHashCommand(id, hash);
			connectionManager.sendCommand(rollHashCommand);

			hasinit = true;
		}
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
		startDieRoll();
	}

	private void readyReceived(ReadyCommand command)
	{
		localPlayer.notifyCommand(command);
		sendAcknowledgement(command.getAckId());
	}

	public void sendRollHash(String hash)
	{
		int id = localPlayer.getId();
		RollHashCommand rollHashCommand = new RollHashCommand(id, hash);
		connectionManager.sendCommand(rollHashCommand);
	}

	public void sendRollNumber(String num)
	{
		int id = localPlayer.getId();
		RollNumberCommand rollNumberCommand = new RollNumberCommand(id, num);
		connectionManager.sendCommand(rollNumberCommand);
	}

	/**
	 * Store the hash for the initial dice roll to select which player takes the first turn.
	 *
	 * @param command
	 */
	private void rollHashCommand(RollHashCommand command)
	{
		startDieRoll();

		initRollHashes[command.getPlayerId()] = command.getHash();

		try {
			die.addHash(command.getPlayerId(), command.getHash());
		} catch (HashMismatchException e) {
			Logger.printf("ERROR - Problem with player %ds hash - %s", command.getPlayerId(), e.getMessage());
			System.exit(-1);
		}

		// If we've received them all, send the roll number.
		boolean hashesReceived = true;

		for (Player player : getPlayers()) {
			if (!player.isNeutral()) {
				String hash = initRollHashes[player.getId()];
				hashesReceived = hashesReceived && hash != null;
			}
		}

		if (hashesReceived && localPlayer != null) {
			int id = localPlayer.getId();

			try {
				die.addHash(id, initRollHashes[id]);
			} catch (HashMismatchException e) {
				Logger.print("ERROR - Couldn't add hash from localplayer id " + id + " (" + initRollHashes[id] + ") " + e.getMessage());
			}

			/* if (!senthash) { */
			/* 	RollHashCommand rollHashCommand = new RollHashCommand(id, initRollHashes[id]); */
			/* 	connectionManager.sendCommand(rollHashCommand); */
			/* 	senthash = true; */
			/* } */
			RollNumberCommand rollNumberCommand = new RollNumberCommand(id, initRollNumbers[id]);
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
		initRollNumbers[command.getPlayerId()] = command.getRollNumberHex();

		try {
			die.addNumber(command.getPlayerId(), command.getRollNumberHex());
		} catch (HashMismatchException e) {
			Logger.printf("ERROR - Problem with player %ds number - %s", command.getPlayerId(), e.getMessage());
			System.exit(-1);
		}

		boolean rollsReceived = true;

		for (Player player : getPlayers()) {
			if (!player.isNeutral()) {
				String number = initRollNumbers[player.getId()];
				rollsReceived = rollsReceived && number != null;
			}
		}

		if (rollsReceived && localPlayer != null) {
			int id = localPlayer.getId();

			try {
				die.addNumber(id, initRollNumbers[id]);
			} catch (HashMismatchException e) {
				Logger.print("ERROR - Couldn't add number from localplayer id " + id + " (" + initRollNumbers[id] + ")");
			}

			try {
				die.finalise();
			} catch (HashMismatchException e) {
				Logger.print("ERROR - Problem finalising all received numbers - " + e.getMessage());
				System.exit(-1);
			}

			if (firstplayer == -1) {
				firstplayer = (int) (die.nextInt() % getPlayers().size());

				Logger.print("Player " + firstplayer + " will go first, rolling again to shuffle deck");
				// Send the computed result of the dice roll to the interface.
				RollResultCommand rollResult = new RollResultCommand(firstplayer);
				localPlayer.notifyCommand(rollResult);
				setCurrentTurn(firstplayer);

				/* senthash = false; */
				hasinit = false;
				startDieRoll();
			} else { // Deck order here
				for (int i = 0; i < 44; i++) {
					deckorder[i] = (int) (die.nextInt() % 44);
					localPlayer.notifyCommand(new RollResultCommand(deckorder[i]));
				}

				for (Player player : getPlayers()) {
					if (player.getType() == PlayerType.AI)
						((AIPlayer)player).setDeckOrder(deckorder);
					else if (player.getType() == PlayerType.LOCAL)
						((LocalPlayer)player).setDeckOrder(deckorder);
				}

				gameState.setDeckOrder(deckorder);
				deckShuffled = true;

				// All initialisation done - start the game loop.
				gameStart.release();
			}
		}
	}

	private void sendAcknowledgement(int ackId)
	{
		// Non-playing hosts don't need to ack.
		if (localPlayer == null) {
			return;
		}

		AcknowledgementCommand ack = new AcknowledgementCommand(localPlayer.getId(), ackId);

		for (Player player : getPlayers()) {
			player.notifyCommand(ack);
		}

		// Update value for next acknowledgement
		this.ackId = ackId + 1;
	}

	private void acknowledgementReceived(AcknowledgementCommand command)
	{
		if (connectionManager.isServer()) {
			Acknowledgement ack = acknowledgements.get(command.getAckId());
			ack.getPlayersAcknowledged()[command.getPlayerId()] = true;
			connectionManager.sendCommand(command);
		}
	}

	/**
	 * Get the acknowledgement ID for the next command, and increment it.
	 *
	 * @return
	 */
	public int nextAckId()
	{
		return ackId++;
	}

	public ConnectionManager getConnectionManager(){
		return connectionManager;
	}

	/**
	 * Requests one army assignment from each player in order, until all armies have been assigned.
	 */
	@Override
	public void assignTerritories()
	{
		gameState.setDeployableArmies(1);

		Command command = null;

		int totalTurns = armiesPerPlayer * this.getPlayers().size();
		for(int i = 0; i < totalTurns; i ++){
			Player player = getCurrentTurnPlayer();
			command = player.getCommand(CommandType.ASSIGN_ARMY);
			notifyPlayers(command);
			nextTurn();

			// Send acknowledgement for the local player.
			sendAcknowledgement(command.getAckId());
		}
	}

	/**
	 * Runs the game, controlling the game flow, and ending when game is complete
	 */
	public void run(){
		assignTerritories();

		while(!gameState.isGameComplete()) {
			Player currentPlayer = getCurrentTurnPlayer();
			int phase = 0;
			while(phase != 4) {
				Command command = null;
				switch (phase){
					case 0:
						command = currentPlayer.getCommand(CommandType.PLAY_CARDS);
						gameState.setDeployableArmies();
						break;
					case 1:
						command = currentPlayer.getCommand(CommandType.DEPLOY);
						break;
					case 2:
						command = currentPlayer.getCommand(CommandType.ATTACK);
						break;
					case 3:
						command = currentPlayer.getCommand(CommandType.FORTIFY);
						break;
				}

				// Send acknowledgement for the local player.
				int ackId = command.getAckId();

				if(command.getType()==CommandType.PLAY_CARDS && phase==0){
					notifyPlayers(command);
					phase = 1;
				}else if(command.getType()==CommandType.DEPLOY && phase < 2) {
					notifyPlayers(command);
					phase = 2;
				}else if(command.getType()==CommandType.ATTACK && phase == 2) {
					attack((AttackCommand)command, currentPlayer);
				}else if(command.getType()==CommandType.FORTIFY){
					notifyPlayers(command);
					phase = 4;
				}

				if (ackId != -1 && command.getType() != CommandType.ACKNOWLEDGEMENT) {
					sendAcknowledgement(ackId);
				}
			}

			nextTurn();
		}
	}
}
