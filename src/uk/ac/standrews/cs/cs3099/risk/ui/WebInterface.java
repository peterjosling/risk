package uk.ac.standrews.cs.cs3099.risk.ui;

import java.net.InetSocketAddress;

public class WebInterface {
    private static final int PORT = 7574;

    public static void main(String args[]) {
        WebSocketServer server = new WebSocketServer(new InetSocketAddress(PORT));
        server.start();

        // TODO launch a file server to serve the web interface
    }
}
