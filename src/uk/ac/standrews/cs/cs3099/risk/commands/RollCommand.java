package uk.ac.standrews.cs.cs3099.risk.commands;

public class RollCommand extends Command{

	private int faces;
	private int numberOfDice;

	public RollCommand(int playerId, int ackId) 
	{
		super(playerId, ackId);
	}

	public RollCommand(int playerId, int ackId, int faces, int numberOfDice) 
	{
		this(playerId, ackId);
		this.faces = faces;
		this.numberOfDice = numberOfDice;
	}

	public int getNumberOfFaces() 
	{
		return faces;
	}

	public int getNumberOfDice()
	{
		return numberOfDice;
	}

	@Override
	public CommandType getType() 
	{
		return CommandType.ROLL;
	}
}
