package uk.ac.standrews.cs.cs3099.risk.game;

import org.java_websocket.WebSocket;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.RollHashCommand;
import uk.ac.standrews.cs.cs3099.risk.commands.RollNumberCommand;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class UIPlayer extends Player {
	protected WebSocket webSocket;
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
		if (type == CommandType.ROLL_HASH) {
			return getRollHashCommand();
		} else if (type == CommandType.ROLL_NUMBER) {
			return getRollNumberCommand();
		}

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

	public Command getRollNumberCommand()
	{
		Die die = this.getDie();
		String number = die.byteToHex(this.getLastRollNumber());

		RollNumberCommand command= new RollNumberCommand(this.getId(), number);
		notifyCommand(command);
		return command;
	}

	public Command getRollHashCommand()
	{
		Die die = this.getDie();
		byte[] num = die.generateNumber();
		this.setLastRollNumber(num);
		byte[] numHash = die.hashByteArr(num);
		String hash = die.byteToHex(numHash);

		RollHashCommand command = new RollHashCommand(this.getId(), hash);
		notifyCommand(command);
		return command;
	}
}
