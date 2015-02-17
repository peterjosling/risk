package uk.ac.standrews.cs.cs3099.risk.game;

public class RollMove extends Move{

	private int faces;
	private int numberOfDice;

	public RollMove(int playerId, int ackId) {
		super(playerId, ackId);
	}

	public RollMove(int playerId, int ackId, int Faces, int numberOfDice) {
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
	public MoveType getType() {
		return MoveType.ROLL;
	}
}
