package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.Set;
import java.util.HashSet;

/**
 * Continent Class
 * Contains all of the properties you would expect of a continent
 */
public class Continent {

	private int id;
	private int continentValue;
	private String name;
	private Set<Territory> territories;

	/**
	 * Creates a continent with the given id
	 * @param id
	 */
	public Continent(int id)
	{
		this.id = id;
		territories = new HashSet<Territory>();
	}

	/**
	 * @return the continent id
	 */
	public int getId()
	{
		return id;
	}

	/**
	 *
	 * @return the value of the continent
	 */
	public int getContinentValue()
	{
		return continentValue;
	}

	/**
	 * @return the name of the continent
	 */
	public String getContinentName()
	{
		return name;
	}

	/**
	 * sets the value of the continent
	 * @param continentValue
	 */
	public void setContinentValue(int continentValue)
	{
		this.continentValue = continentValue;
	}

	/**
	 * Sets the name of the continent
	 * @param name
	 */
	public void setContinentName(String name)
	{
		this.name = name;
	}

	/**
	 * Adds a new territory to the set of territories that make up this continent
	 * @param t the territory instance to add
	 */
	public void addTerritory(Territory t)
	{
		territories.add(t);
	}

	/**
	 * @return the set of territories that make up the continent
	 */
	public Set<Territory> getTerritories()
	{
		return territories;
	}

	/**
	 * Sets the name of the continent
	 * @param name
	 */
	public void setName(String name)
	{
		this.name = name;
	}

	/**
	 * @return the name of the continent
	 */
	public String getName()
	{
		return name;
	}
}
