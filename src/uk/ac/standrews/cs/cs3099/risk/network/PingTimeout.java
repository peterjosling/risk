package uk.ac.standrews.cs.cs3099.risk.network;

public class PingTimeout implements Runnable {
	private NetworkedGame game;

	public PingTimeout(NetworkedGame game)
	{
		this.game = game;
	}

	@Override
	public void run()
	{
		try {
			Thread.sleep(game.getMoveTimeout() * 1000);

			if (game.getNumberOfPingsReceived() < game.getPlayers().size()) {
				game.sendReadyCommand();
			}
		} catch (InterruptedException e) {
			System.err.println("Failed to sleep child thread.");
			System.exit(1);
		}
	}
}
