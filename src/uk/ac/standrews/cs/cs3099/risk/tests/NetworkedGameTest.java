package uk.ac.standrews.cs.cs3099.risk.tests;

import org.junit.Test;
import uk.ac.standrews.cs.cs3099.risk.network.NetworkedGame;

import java.io.IOException;

public class NetworkedGameTest {
	@Test
	public void nonPlayingHostTest() throws IOException
	{
		NetworkedGame game = new NetworkedGame();
//		game.startServer(1234);

		NetworkedGame client = new NetworkedGame();
//		client.connectToServer("localhost", 1234);
	}
}
