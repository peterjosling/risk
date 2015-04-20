package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.Set;
import java.util.HashSet;

/**
 * Territory Class
 * Each little piece of land has these properties
 */
public class Territory {
	private String name;
	private int id;
	private Continent continent;
	private Set<Territory> links;
	private int owner = -1;

	private int armies;

	/**
	 * Create a territory with a given id and Continent which it is part of
	 * @param id
	 * @param continent
	 */
	public Territory(int id, Continent continent)
	{
		this.id = id;
		this.continent = continent;
		this.links = new HashSet<Territory>();

		this.armies = 0;
	}

	/**
	 * @return the id of the territory
	 */
	public int getId()
	{
		return id;
	}

	/**
	 * @return the number of armies on the territory
	 */
	public int getArmies()
	{
		return armies;
	}

	/**
	 * sets the name of the territory
	 * @param name
	 */
	public void setName(String name)
	{
		this.name = name;
	}

	/**
	 * @return the name of the territory
	 */
	public String getName()
	{
		return name;
	}

	/**
	 * sets the number of armies on the territory
	 * @param armies the number of armies
	 */
	public void setArmies(int armies)
	{
		this.armies = armies;
	}

	/**
	 * makes a link between a this territory and the specified territory
	 * @param t the territory to link to
	 */
	public void addLink(Territory t)
	{
		links.add(t);
	}

	/**
	 * Checks whether there is a link between this territory and the specified territory
	 * @param t the territory to check for a link to
	 * @return true if connected false if not
	 */
	public boolean isLinkedTo(Territory t)
	{
		return links.contains(t);
	}

	/**
	 * A Set of all the territories that this territory is connected to
	 *  @return the set of territories
	 */
	public Set<Territory> getLinkedTerritories()
	{
		return links;
	}

	/**
	 * Adds the specified number of armies to the current army count on this territory
	 * @param numberOfArmies the number of armies ot add
	 * @return true if number of armies added is positive, false if not
	 */
	public boolean addArmies(int numberOfArmies)
	{
		if (numberOfArmies < 0) {
			return false;
		} else {
			armies = armies + numberOfArmies;
			return true;
		}
	}

	/**
	 * Remove the specified number of armies to the current army count on this territory
	 * @param numberOfArmies the number of armies to add
	 * @return true if number of armies removed is negative or false if not
	 */
	public boolean removeArmies(int numberOfArmies)
	{
		if (numberOfArmies < 0 || numberOfArmies > armies) {
			return false;
		} else {
			armies = armies - numberOfArmies;
			return true;
		}
	}

	/**
	 * @return the player id of the player that owns the territory
	 */
	public int getOwner()
	{
		return owner;
	}

	/**
	 * @return true if the territory is claimed, false if not
	 */
	public boolean isClaimed()
	{
		return owner != -1;
	}

	/**
	 * Set the owner of the territory to the specified player id
	 * @param playerID the id of the player
	 */
	public void claim(int playerID)
	{
		owner = playerID;
	}
}
