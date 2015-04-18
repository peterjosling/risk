package uk.ac.standrews.cs.cs3099.risk.network;

public class ReadyAcknowledgementTimeout extends AcknowledgementTimeout {
	private NetworkedGame game;

	public ReadyAcknowledgementTimeout(NetworkedGame game, int ackId)
	{
		super(game, ackId);
		this.game = game;
	}

	@Override
	public void callback()
	{
		game.sendInitialiseGameCommand();
	}
}
