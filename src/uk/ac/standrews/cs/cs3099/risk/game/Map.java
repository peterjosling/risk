package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.List;
import java.util.ArrayList;

/**
 * Map Class
 * Holds all the data pertaining to the map
 */
public class Map {

    private List<Continent> continents;
    private List<Territory> territories;


    public Map()
    {
        // This class will probably parse map data, so those member
        // variables don't need to be passed into the constructor
    }

    public List<Continent> getContinents()
    {
        return continents;
    }

    public List<Territory> getTerritories()
    {
        return territories;
    }

    private Territory findTerritoryById(int id)
    {
        Territory result = null;

        for (Territory t : territories) {
            if (t.getId() == id) {
                result = t;
                break;
            }
        }

        return result;
    }

    // TEMPORARY MEASURE, just to demo the map parse logic before a JSON parser is actually used
    private class KeyValue {
        public int key;
        public int value;
        public int[] value_arr;
    }

    private class ParsedJson {
        public List<KeyValue> continents;
        public List<KeyValue> connections;
        public List<KeyValue> continent_values;
    }

    public void parseMapData(String json) throws MapParseException
    {
        // Will need to parse the json here, probably into KeyValue pairs
        // See "Risk Data.docx"
        ParsedJson parsedjson = new ParsedJson();

        continents = new ArrayList<Continent>();
        territories = new ArrayList<Territory>();

        // Add all continents and associated territories
        for (KeyValue pair : parsedjson.continents) {
            Continent c = new Continent(pair.key);

            // Add the continent to the global list
            continents.add(c);

            for (Integer id : pair.value_arr) {
                Territory t = new Territory(id, c);

                // Add the territory to the continent and to the global list
                c.addTerritory(t);
                territories.add(t);
            }
        }

        // Loop through the connections and populate the links for each territory
        for (KeyValue pair : parsedjson.connections) {
            // Make quicker using Map<Integer, Territory> ?
            // Currently O(2n * m), not good
            Territory t1 = findTerritoryById(pair.key), t2 = findTerritoryById(pair.value);

            // Add the links bidirectionally
            t1.addLink(t2);
            t2.addLink(t1);
        }

        for (KeyValue pair : parsedjson.continent_values) {
            Continent c = null;

            // Find the continent by id and set its corresponding value
            for (Continent c2 : continents) {
                if (c2.getId() == pair.key) {
                    c = c2;
                    break;
                }
            }

            if (c == null)
                throw new MapParseException("Continent not previously found (invalid id)");

            c.setContinentValue(pair.value);
        }
    }
}
