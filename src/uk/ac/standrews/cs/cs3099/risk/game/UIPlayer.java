package uk.ac.standrews.cs.cs3099.risk.game;

import org.java_websocket.WebSocket;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class UIPlayer extends Player {
	private WebSocket webSocket;
	private BlockingQueue<Command> moveQueue = new LinkedBlockingQueue<Command>();

	public UIPlayer(WebSocket ws, int id, String name)
	{
		super(id, name);
		webSocket = ws;
	}

	@Override
	public PlayerType getType()
	{
		return PlayerType.UI;
	}
	
	public void queueCommand(Command command)
	{
		moveQueue.add(command);
	}

	@Override
	public Command getCommand(CommandType type)
	{
		try {
			return moveQueue.take();
		} catch (InterruptedException e) {
			System.err.println("Failed to get move from queue.");
			e.printStackTrace();
		}

		return null;
	}

	@Override
	public void notifyCommand(Command command)
	{
		webSocket.send(command.toJSON());
	}

	@Override
	public boolean isNeutral() {
		return isNeutral;
	}

	public void setNeutral(boolean neutral) {
		isNeutral = neutral;
	}
}
