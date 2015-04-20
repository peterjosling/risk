package uk.ac.standrews.cs.cs3099.risk.game;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Map.*;

/**
 * Map Class
 * Holds all the data pertaining to the map
 */
public class Map {

	private List<Continent> continents = new ArrayList<Continent>();
	private List<Territory> territories = new ArrayList<Territory>();

	/**
	 * Creates a map using the given map parser which parses a json map.
	 * @param m the map parser
	 */
	public Map(MapParser m)
	{
		continents = m.getContinents();
		territories = m.getTerritories();
	}

	public Map()
	{
		// Just to have country generation
	}

	/**
	 * @return a list of all the continents in the map
	 */
	public List<Continent> getContinents()
	{
		return continents;
	}

	/**
	 * @return a list of all the territories in the map
	 */
	public List<Territory> getTerritories()
	{
		return territories;
	}

	/**
	 * Given a territory id returns a Territory instance with this id
	 * @param id - the territory id
	 * @return the matching territory or null if none found
	 */
	public Territory findTerritoryById(int id)
	{
		for (Territory t : territories)
			if (t.getId() == id)
				return t;

		return null;
	}

	/**
	 * Given a Continent id returns a Continent instance with this id
	 * @param id - the Continent id
	 * @return the matching Continent or null if none found
	 */
	public Continent getContinentById(int id)
	{
		for (Continent continent : continents) {
			if (continent.getId() == id) {
				return continent;
			}
		}

		return null;
	}
}
