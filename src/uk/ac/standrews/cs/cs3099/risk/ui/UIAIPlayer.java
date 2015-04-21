package uk.ac.standrews.cs.cs3099.risk.ui;

import org.java_websocket.WebSocket;
import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.*;
import uk.ac.standrews.cs.cs3099.risk.game.Die;
import uk.ac.standrews.cs.cs3099.risk.game.HashMismatchException;
import uk.ac.standrews.cs.cs3099.risk.game.Logger;
import uk.ac.standrews.cs.cs3099.risk.game.UIPlayer;

import java.util.ArrayList;

public class UIAIPlayer extends UIPlayer {
	AIPlayer aiPlayer;
	int totalarmies;
	Die die;

	public UIAIPlayer(WebSocket ws, int id, String name, AIPlayer aiPlayer)
	{
		super(ws, id, name);
		this.aiPlayer = aiPlayer;
	}

	@Override
	public Command getCommand(CommandType type)
	{
		Command command = aiPlayer.getCommand(type);
		webSocket.send(command.toJSON());
		return command;
	}

	@Override
	public void notifyCommand(Command command)
	{
		if (command.getType() == CommandType.ATTACK) {
			totalarmies = ((AttackCommand) command).getArmies();
		} else if (command.getType() == CommandType.DEFEND) {
			totalarmies += ((DefendCommand) command).getArmies();
			die = new Die();
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

			if (die.getNumberSeedSources() == die.getNumberHashes()) {
				webSocket.send(command.toJSON());
				aiPlayer.notifyCommand(command);

				try {
					die.finalise();
				} catch (HashMismatchException e) {
					Logger.print("ERROR - Problem finalising: " + e.getMessage());
				}

				int[] resultingRolls = die.rollDiceNetwork(totalarmies);
				for (int i = 0; i < resultingRolls.length; i++) {
					RollResultCommand rollResult = new RollResultCommand(resultingRolls[i]);
					webSocket.send(command.toJSON());
					aiPlayer.notifyCommand(command);
				}

				die = null;
				return;
			}
		}
		webSocket.send(command.toJSON());
		aiPlayer.notifyCommand(command);

		// Initialise the AI once we know how many players there are.
		if (command.getType() == CommandType.PING) {
			PingCommand pingCommand = (PingCommand) command;

			if (pingCommand.getNoOfPlayers() > 0) {
				ArrayList<Integer> playerIds = new ArrayList<Integer>();

				for (int i = 0; i < pingCommand.getNoOfPlayers(); i++) {
					playerIds.add(i);
				}

				aiPlayer.initialiseGameState(playerIds);
			}
		}
	}

	@Override
	public void setId(int id)
	{
		super.setId(id);
		aiPlayer.setId(id);
	}
}
