package uk.ac.standrews.cs.cs3099.risk.commands;

public enum CommandType {
	ATTACK,
	FORTIFY,
	DEPLOY,
	DRAW_CARD,
	ASSIGN_ARMY,
	DEFEND,
	JOIN_GAME,
	ACCEPT_JOIN_GAME,
	REJECT_JOIN_GAME,
	ACKNOWLEDGEMENT,
	TIMEOUT,
	ATTACK_CAPTURE,
	LEAVE_GAME,
	ROLL_NUMBER, 
	ROLL_HASH, 
	ROLL, 
	PLAY_CARDS,
	PING,
	READY,
	INITIALISE_GAME,
	PLAYERS_JOINED
}
