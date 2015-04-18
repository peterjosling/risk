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
			game.startServer(1234);
		} catch (MapParseException e) {
			e.printStackTrace();
		}


		try {
			NetworkedGame client = new NetworkedGame(24, "jsonMap");
			game.connectToServer("localhost", 1234);
		} catch (MapParseException e) {
			e.printStackTrace();
		}

	}
}
