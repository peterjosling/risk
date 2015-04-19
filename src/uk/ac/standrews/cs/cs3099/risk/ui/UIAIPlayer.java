package uk.ac.standrews.cs.cs3099.risk.ui;

import org.java_websocket.WebSocket;
import uk.ac.standrews.cs.cs3099.risk.ai.AIPlayer;
import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;
import uk.ac.standrews.cs.cs3099.risk.game.UIPlayer;

public class UIAIPlayer extends UIPlayer{

	AIPlayer aiPlayer;

	public UIAIPlayer(WebSocket ws, int id, String name, AIPlayer aiPlayer)
	{
		super(ws, id, name);
		this.aiPlayer = aiPlayer;
	}

	@Override
	public Command getCommand(CommandType type){
		Command command = aiPlayer.getCommand(type);
		webSocket.send(command.toJSON());
		return command;
	}

	@Override
	public void notifyCommand(Command command){
		aiPlayer.notifyCommand(command);
		webSocket.send(command.toJSON());
	}
}
