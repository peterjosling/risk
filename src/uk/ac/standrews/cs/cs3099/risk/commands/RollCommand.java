package uk.ac.standrews.cs.cs3099.risk.commands;

import uk.ac.standrews.cs.cs3099.risk.game.*;

public class RollCommand extends Command{

	private int faces;
	private int numberOfDice;

	public RollCommand(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollCommand(int playerId, int ackId, int Faces, int numberOfDice) {
		this(playerId, ackId);
		this.faces = faces;
		this.numberOfDice = numberOfDice;
	}

	public int getNumberOfFaces() {
		return faces;
	}

	public int getNumberOfDice(){
		return numberOfDice;
	}

	@Override
	public CommandType getType() {
		return CommandType.ROLL;
	}
}