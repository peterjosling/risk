package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.Set;
import java.util.HashSet;

/**
 * Continent Class
 * Contains all of the properties you would expect of a continent
 */
public class Continent {

    private int id;
    private int continentvalue;
    private HashSet<Territory> territories;


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
        return continentvalue;
    }

    public void setContinentValue(int continentvalue)
    {
        this.continentvalue = continentvalue;
    }

    public void addTerritory(Territory t)
    {
        territories.add(t);
    }
    
    public void getTerritories()
    {
        return territories;
    }
}
