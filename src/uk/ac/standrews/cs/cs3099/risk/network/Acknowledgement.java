package uk.ac.standrews.cs.cs3099.risk.network;

import java.util.Date;

public class Acknowledgement {

	private Date date; // time created
	private int ackId; //
	private boolean[] playersAcknowledged; // players that have acknowledged this command


	/**
	 * Create an Acknowledgement instance with the given ackid
	 * @param ackid
	 */
	Acknowledgement(int ackid){
		date = new Date();
		this.ackId = ackid;
		playersAcknowledged = new boolean[6]; //indexed by player ids
	}


	/**
	 * @return the time command was created
	 */
	public Date getTimeCreated() {
		return date;
	}

	/**
	 * the ackid of the command that this acknowledgement corresponds to
	 * @return AckId
	 */
	public int getAckId() {
		return ackId;
	}

	/**
	 * @return an array of whether each player has acknowledged the command
	 */
	public boolean[] getPlayersAcknowledged() {
		return playersAcknowledged;
	}

}
