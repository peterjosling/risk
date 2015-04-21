package uk.ac.standrews.cs.cs3099.risk.game;

import org.java_websocket.WebSocket;

import uk.ac.standrews.cs.cs3099.risk.commands.*;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class UIPlayer extends Player {
	protected WebSocket webSocket;
	private BlockingQueue<Command> moveQueue = new LinkedBlockingQueue<Command>();

	private int totalarmies;
	private Die die;

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
		if (command.getType() == CommandType.ATTACK) {
			totalarmies = ((AttackCommand) command).getArmies();

			die = new Die();
		} else if (command.getType() == CommandType.DEFEND) {
			totalarmies += ((DefendCommand) command).getArmies();

			webSocket.send(command.toJSON());

			int[] resultingRolls = die.rollDiceNetwork(totalarmies);
			for (int i = 0; i < resultingRolls.length; i++) {
				RollResultCommand rollResult = new RollResultCommand(resultingRolls[i]);
				webSocket.send(rollResult.toJSON());
			}

			die = null;
			return;
		} else if (die != null && command.getType() == CommandType.ROLL_HASH) {
			try {
				die.addHash(command.getPlayerId(), ((RollHashCommand) command).getHash());
			} catch (HashMismatchException e){
				Logger.print("ERROR - Problem calculating roll hash - " + e.getMessage());
			}
		} else if (die != null && command.getType() == CommandType.ROLL_NUMBER) {
			try {
				die.addNumber(command.getPlayerId(), ((RollNumberCommand) command).getRollNumberHex());
			} catch (HashMismatchException e) {
				Logger.print("ERROR - Problem calculating roll number - " + e.getMessage());
			}
		}

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
