package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;

/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

	private Map map;
	private Deck deck;

	private final int DECK_SIZE = 44;
	private final int TEMP_SEED = 123456;

	public GameState()
	{
		deck = new Deck(DECK_SIZE);
		deck.shuffle(TEMP_SEED);
	}

	public void loadMap(String json) throws MapParseException
	{
		map = new Map();

		map.parseMapData(json);
	}

	public void removeArmiesForTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.removeArmies(armies);
	}

	public void addArmiesForTerritory(int id, int armies)
	{
		Territory territory = map.findTerritoryById(id);
		territory.addArmies(armies);
	}

	public void moveArmies(int from, int to, int armies)
	{
		removeArmiesForTerritory(from, armies);
		addArmiesForTerritory(to, armies);
	}

	/**
	 * @return Array of {@link Territory} instances which have no owner.
	 */
	public Territory[] getUnclaimedTerritories()
	{
		return getTerritoriesForPlayer(-1);
	}

	/**
	 * Get all territories currently owned by a player.
	 * @param playerID ID of the player to find territories for.
	 * @return Array of {@link Territory}.
	 */
	public Territory[] getTerritoriesForPlayer(int playerID)
	{
		ArrayList<Territory> territories = new ArrayList<Territory>();

		for (Territory territory : map.getTerritories()) {
			if (territory.getOwner() == playerID) {
				territories.add(territory);
			}
		}

		return territories.toArray(new Territory[0]);
	}
	
	public void playMove(Move move, int playerID){
		MoveType moveType = move.getType();
		if(moveType==MoveType.ASSIGN_ARMY){
			Territory territory = map.findTerritoryById(((AssignArmyMove) move).getTerritoryId());
			territory.addArmies(1);
			territory.claim(playerID);
		}
		else if(moveType==MoveType.FORTIFY){

		}
		else if(moveType==MoveType.ATTACK){

		}
		else if(moveType==MoveType.DEPLOY){

		}
		else if(moveType==MoveType.TRADE_IN_CARDS){

		}
		else if(moveType==MoveType.DRAW_CARD){

		}

	}

	public boolean isGameComplete()
	{
		
		int player = -1;
		
		for (Territory territory : map.getTerritories()) {
			if (player == -1){
				player = territory.getOwner();
			} else if (territory.getOwner() != player) {
				return false;
			}
		}
		
		return true;

	}
}

