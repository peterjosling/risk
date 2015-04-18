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


	public Continent(int id)
	{
		this.id = id;
		territories = new HashSet<Territory>();
	}

	public int getId()
	{
		return id;
	}

	public int getContinentValue()
	{
		return continentValue;
	}

	public void setContinentValue(int continentValue)
	{
		this.continentValue = continentValue;
	}

	public void addTerritory(Territory t)
	{
		territories.add(t);
	}

	public Set<Territory> getTerritories()
	{
		return territories;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getName()
	{
		return name;
	}
}
