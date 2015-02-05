package uk.ac.standrews.cs.cs3099.risk.game;

public class LocalPlayer extends Player {
	public LocalPlayer(int id, String name)
	{
		super(id, name);
	}

	@Override
	public Move getMove(MoveType type)
	{
		return null;
	}

	@Override
	public void notifyMove(Move move)
	{

	}
}
