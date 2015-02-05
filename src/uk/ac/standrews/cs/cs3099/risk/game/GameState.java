package uk.ac.standrews.cs.cs3099.risk.game;

/**
 * GameState Class
 * Stores the entire game and controls board movement
 */
public class GameState {

	private Map map;
	private Object deck;


	public GameState()
	{
		deck = new Object();
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
}
