package uk.ac.standrews.cs.cs3099.risk.tests;

import org.junit.Test;
import uk.ac.standrews.cs.cs3099.risk.game.MapParseException;
import uk.ac.standrews.cs.cs3099.risk.network.NetworkedGame;

import java.io.IOException;

public class NetworkedGameTest {
	@Test
	public void nonPlayingHostTest() throws IOException
	{
		NetworkedGame game = null;
		try {
			game = new NetworkedGame(24, "jsonMap");
		} catch (MapParseException e) {
			e.printStackTrace();
		}
		game.startServer(1234);

		try {
			NetworkedGame client = new NetworkedGame(24, "jsonMap");
		} catch (MapParseException e) {
			e.printStackTrace();
		}
		game.connectToServer("localhost", 1234);
	}
}
