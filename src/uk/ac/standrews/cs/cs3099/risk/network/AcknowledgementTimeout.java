package uk.ac.standrews.cs.cs3099.risk.network;

import uk.ac.standrews.cs.cs3099.risk.commands.TimeoutCommand;

public class AcknowledgementTimeout implements Runnable {
	private NetworkedGame game;
	private int ackId;

	public AcknowledgementTimeout(NetworkedGame game, int ackId)
	{
		this.game = game;
		this.ackId = ackId;
	}

	@Override
	public void run()
	{
		try {
			Thread.sleep(game.getAcknowledgementTimeout() * 1000);

			if (!game.allAcknowledgementsReceived(ackId)) {
				//send timeout for all dead players.
				ConnectionManager connectionManager = game.getConnectionManager();
				if (connectionManager.isServer()) {
					game.timeoutPlayersNotAcknowledged(ackId);
				}
			}

			callback();
		} catch (InterruptedException e) {
			System.err.println("Failed to sleep child thread.");
			System.exit(1);
		}
	}

	/*
	 * Method to be overridden in subclasses for performing actions after acks received.
	 */
	public void callback() {}
}
