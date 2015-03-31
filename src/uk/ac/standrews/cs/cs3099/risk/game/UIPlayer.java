package uk.ac.standrews.cs.cs3099.risk.game;

import org.java_websocket.WebSocket;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class UIPlayer extends Player {
	private WebSocket webSocket;
	private BlockingQueue<Command> moveQueue = new LinkedBlockingQueue();

	public UIPlayer(WebSocket ws, int id, String name)
	{
		super(id, name);
		webSocket = ws;
	}

	public void queueCommand(Command move)
	{
		moveQueue.add(move);
	}

	@Override
	public Command getMove(CommandType type)
	{
		try {
			return moveQueue.take();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		return null;
	}

	@Override
	public void notifyMove(Command move)
	{
		// TODO send move JSON down websocket.
	}
}
