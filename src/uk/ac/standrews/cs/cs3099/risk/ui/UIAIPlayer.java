package uk.ac.standrews.cs.cs3099.risk.ui;

import org.java_websocket.WebSocket;
import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.commands.PingCommand;
import uk.ac.standrews.cs.cs3099.risk.game.UIPlayer;

import java.util.ArrayList;

public class UIAIPlayer extends UIPlayer {
	AIPlayer aiPlayer;

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
