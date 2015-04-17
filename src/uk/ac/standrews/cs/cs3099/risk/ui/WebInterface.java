package uk.ac.standrews.cs.cs3099.risk.ui;

import org.jibble.simplewebserver.SimpleWebServer;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;

public class WebInterface {
	private static final int PORT = 7574;

	public static void main(String args[]) {
		WebSocketServer webSocketServer = new WebSocketServer(new InetSocketAddress(PORT));
		SimpleWebServer webServer;
		webSocketServer.start();

		try {
			webServer = new SimpleWebServer(new File("www/"), 9091);
		} catch (IOException e) {
			System.out.println("Failed to launch web server on port 9091");
			System.exit(1);
		}

		// Launch the default web browser to show the interface.
		try {
			Desktop.getDesktop().browse(new URI("http://localhost:9091"));
		} catch (Exception e) {
			System.out.println("Failed to launch web browser.");
		}
	}
}
