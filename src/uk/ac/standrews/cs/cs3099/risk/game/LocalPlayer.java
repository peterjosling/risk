package uk.ac.standrews.cs.cs3099.risk.game;

public class LocalPlayer extends Player {
	public LocalPlayer(int id)
	{
		super(id);
	}

	public LocalPlayer(int id, String name)
	{
		super(id, name);
	}

	@Override
	public Command getMove(CommandType type)
	{
		Command command;
		int id = this.getId();
		int ackId = 1;
		int sourceTerritory;
		int destinationTerritory;
		int armies;
		switch (type){
			case DEPLOY:
				break;
			case FORTIFY:
				sourceTerritory = 1;
				destinationTerritory = 2;
				armies = 1;
				command = new FortifyMove(id, ackId, sourceTerritory, destinationTerritory, armies);
				break;
			case ATTACK:
				sourceTerritory = 1;
				destinationTerritory = 2;
				armies = 1;
				command = new AttackMove(id, ackId, sourceTerritory, destinationTerritory, armies);
				break;
			case ASSIGN_ARMY:
				destinationTerritory = 1;
				command = new AssignArmyMove(id, ackId, destinationTerritory);
				break;
			case DRAW_CARD:
				break;
			case TRADE_IN_CARDS:
				break;
		}
		return null;
	}

	@Override
	public void notifyMove(Command command)
	{

	}
}
