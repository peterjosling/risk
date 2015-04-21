package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.network.ConnectionManager;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;

public class NetworkPlayer extends Player {
	private ConnectionManager connectionManager;

	/**
	 * Queues the commands being sent down the network players socket
	 */
	private BlockingQueue<Command> moveQueue = new LinkedBlockingDeque<Command>();

	@Override
	public PlayerType getType()
	{
		return PlayerType.NETWORK;
	}

	/**
	 * Creates a new network player without a name
	 * @param connectionManager - the connection manager which manages the connection to the host
	 * @param id - the id of the player
	 */
	public NetworkPlayer(ConnectionManager connectionManager, int id)
	{
		super(id);
		this.connectionManager = connectionManager;
	}

	/**
	 * Creates a new network player without a name
	 * @param connectionManager - the connection manager which manages the connection to the host
	 * @param id - the id of the player
	 */
	public NetworkPlayer(ConnectionManager connectionManager, int id, String name)
	{
		super(id, name);
		this.connectionManager = connectionManager;
	}

	/**
	 * @return the queued commands for a NetworkPlayer Instance
	 */
	public BlockingQueue getMoveQueue()
	{
		return moveQueue;
	}

	/**
	 * Takes the fist command off the move queue
	 * @param type - the type of command expected
	 * @return the command
	 */
	@Override
	public Command getCommand(CommandType type)
	{
		try {
			return moveQueue.take();
		} catch (InterruptedException e) {
			System.err.println("Failed to get move for player " + getId());
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * Sends a command to the host to inform all other players
	 * @param command the command to send
	 */
	@Override
	public void notifyCommand(Command command)
	{
		connectionManager.sendCommand(command);
	}

}
