package uk.ac.standrews.cs.cs3099.risk.game;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

public class NetworkPlayer extends Player {
	private String ip;
	private int port;
	private Socket socket;

	public NetworkPlayer(int id, String ip, int port)
	{
		super(id);
		this.ip = ip;
		this.port = port;
	}

	public NetworkPlayer(int id, String name, String ip, int port)
	{
		super(id, name);
		this.ip = ip;
		this.port = port;
	}

	public void connect() throws IOException
	{
		socket = new Socket(InetAddress.getByName(ip), port);
	}

	@Override
	public Command getCommand(CommandType type)
	{
		return null;
	}

	@Override
	public void notifyCommand(Command command)
	{

	}
}
