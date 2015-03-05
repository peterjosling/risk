package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

public class LocalPlayer extends Player {
	public LocalPlayer(int id)
	{
		super(id);
	}

	public LocalPlayer(int id, String name)
	{
		super(id, name);
	}

	@Override
	public Command getMove(CommandType type)
	{
		return null;
	}

	@Override
	public void notifyMove(Command move)
	{

	}
}
