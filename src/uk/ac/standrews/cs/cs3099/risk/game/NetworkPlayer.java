package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.network.ConnectionManager;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;

public class NetworkPlayer extends Player {
	private ConnectionManager connectionManager;
	private BlockingQueue<Command> moveQueue = new LinkedBlockingDeque<Command>();

	public NetworkPlayer(ConnectionManager connectionManager, int id)
	{
		super(id);
		this.connectionManager = connectionManager;
	}

	public NetworkPlayer(ConnectionManager connectionManager, int id, String name)
	{
		super(id, name);
		this.connectionManager = connectionManager;
	}

	public BlockingQueue getMoveQueue()
	{
		return moveQueue;
	}

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

	@Override
	public void notifyCommand(Command command)
	{
		connectionManager.sendCommand(command);
	}

	public boolean isNeutral() {
		return isNeutral;
	}

	public void makeNeutral() {
		isNeutral = !isNeutral;
	}
}
