package uk.ac.standrews.cs.cs3099.risk.network;

import java.util.Date;

public class Acknowledgement {

	private Date date;
	private int ackId;
	private boolean[] playersAcknowledged;


	Acknowledgement(int ackid){
		date = new Date();
		this.ackId = ackid;
		playersAcknowledged = new boolean[6]; //indexed by player ids
	}


	public Date getTimeCreated() {
		return date;
	}

	public int getAckId() {
		return ackId;
	}

	public boolean[] getPlayersAcknowledged() {
		return playersAcknowledged;
	}

}
