package uk.ac.standrews.cs.cs3099.risk.ai;

import uk.ac.standrews.cs.cs3099.risk.game.Move;
import uk.ac.standrews.cs.cs3099.risk.game.Player;

public class DumbPlayer extends Player {
	public DumbPlayer(int id, String name)
	{
		super(id, name);
	}

	public Move getMove()
	{
		return null;
	}

	public void notifyMove(Move move)
	{
		// No-op. Dumb player ignores move input.
	}
}
