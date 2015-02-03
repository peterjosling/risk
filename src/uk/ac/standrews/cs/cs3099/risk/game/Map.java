package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.List;
import java.util.ArrayList;
import java.util.Map.Entry;
import java.util.Random;
import com.google.gson.*;

/**
 * Map Class
 * Holds all the data pertaining to the map
 */
public class Map {

    private List<Continent> continents;
    private List<Territory> territories;

    private final String[][] territoryNames = {{"Act", "Afr", "Ag", "Agr", "Alb", "Am", "An", "Angl", "Ant", "Aqu", "Ar", "Arc", "As", "Atl", "Austr",
                                                "Eb", "Eg", "Eng", "Er", "Esc", "Esp", "Est", "Eth", "Etr", "Eul", "Euph", "Eur", "Ib", "Ind", "It",
                                                "Ug", "Urs", "Ut", "Ur", "Ol", "Olv", "Olm", "Or", "Orm", "Ord", "Os"},
                                               {"Bol", "Br", "Brund", "Burg", "Byth", "Byz", "Call", "Cas", "Casp", "Cast", "Cast", "Castr", "Cath",
                                                "Cel", "Ces", "Ch", "Chin", "Cor", "Cr", "Cypr", "Dal", "Dam", "Dan", "Ferr", "Flor", "Gall", "Gen",
                                                "Germ", "Gran", "Helv", "Hib", "Jap", "Jud", "Laur", "Lib", "Lith", "Luc", "Lyr", "Maj", "Mal", "Mall",
                                                "Man", "Manch", "Mars", "Merc", "Min", "Mir", "Mol", "Myr", "Myt", "Nam", "Nar", "Nor", "Nub", "Pan",
                                                "Par", "Pel", "Per", "Pont", "Rhod", "Rhyd", "Rom", "Russ", "Sal", "Sar", "Scot", "Seg", "Senz", "Sib",
                                                "Spar", "Sum", "Sw", "Sylv", "Tasm", "Terr", "Tes", "Th", "Theon", "Tim", "Tir", "Tr", "Tun", "Tyr",
                                                "Vir", "Xan", "Zan", "Zeel", "Zen", "Zim"},
                                               {"ab", "ac", "ad", "ag", "al", "an", "and", "ann", "ant", "anth", "ar", "arc", "arct", "ard", "arn",
                                                "art", "as", "at", "atr", "av", "en", "enn", "ent", "er", "ern", "es", "et", "ev", "ian", "iat", "ib",
                                                "ic", "iet", "il", "in", "inth", "is", "it", "itr", "iv", "on", "ont", "op", "or", "orc", "os", "ov",
                                                "uan", "uar", "un", "und", "ur", "yc", "yg", "ymn", "yn", "yr", "ys"},
                                               {"a", "aea", "aia", "ana", "and", "as", "ea", "ene", "eos", "ia", "ias", "ica", "ini", "ion", "is",
                                                "ium", "ius", "on", "ona", "or", "ova", "ul", "um", "ur", "us", "ya", "ano", "ar", "ir"}
                                              };

    /**
     * Random territory name
     * Generates a random territory name, since territories have no stored value currently in the spec
     */
    public  String getRandomName(Random r)
    {
        int n = r.nextInt(3);
        String end = territoryNames[3][r.nextInt(territoryNames[3].length - 1)];

        if (n < 2)
            return territoryNames[n][r.nextInt(territoryNames[n].length - 1)] + territoryNames[2][r.nextInt(territoryNames[2].length - 1)] + end;

        return territoryNames[0][r.nextInt(territoryNames[0].length - 1)] + end;
    }

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
        for (Territory t : territories)
            if (t.getId() == id)
                return t;

        return null;
    }

    /*{
        "data":"map",
        "continents": {
            "CONTINENT_ID1":["COUNTRY_ID1", "COUNTRY_ID2"],
            "CONTINENT_ID2":["COUNTRY_ID3", "COUNTRY_ID4"],
        },
        "connections": [
            ["COUNTRY_IDN","COUNTRY_IDM"],
            ["COUNTRY_IDO","COUNTRY_IDP"]
        ],
        "continent_values": {
            "CONTINENT_ID1":1
            "CONTINENT_ID2":2
        },
        "continent_names": {
            "0":"Best continent",
            "2":"EU Travesty"
        },
        "country_name": {
            "0":"Amerilard",
            "1":"Sound Ameripoor"
        },
        "country_card": {
            "0":0,
            "1":2
        },
        "wildcards":2
    }*/


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

    private boolean checkParsed(boolean parsed, String key) throws MapParseException
    {
        if (parsed)
            throw new MapParseException("Already parsed " + key);

        return true;
    }

    public void parseMapData(String json) throws MapParseException
    {
        JsonParser jp = new JsonParser();
        JsonElement je;
        JsonObject jo;
        boolean[] parsed = new boolean[8]; // 8 == number of expected elements in map JSON data

        try {
            je = jp.parse(json);
            jo = je.getAsJsonObject();
        } catch (Exception e) {
            throw new MapParseException("Malformed JSON supplied");
        }

        continents = new ArrayList<Continent>();
        territories = new ArrayList<Territory>();

        try {
            for (Entry e : jo.entrySet()) {
                String key = e.getKey();
                JsonElement value = e.getValue();

                switch (key) {
                    case "data":
                        parsed[0] = checkParsed(parsed[0], "data");

                        if (!value.getAsString().equals("map"))
                            throw new MapParseException("Datatype is not a map");
                        break;
                    case "continents":
                        parsed[1] = checkParsed(parsed[1], "contients");


                        break;
                    case "connections":
                        parsed[2] = checkParsed(parsed[2], "connections");
                        break;
                    case "continent_values":
                        parsed[3] = checkParsed(parsed[3], "continent_values");
                        break;
                    case "continent_names":
                        parsed[4] = checkParsed(parsed[4], "continent_names");
                        break;
                    case "country_name":
                        parsed[5] = checkParsed(parsed[5], "country_name");
                        break;
                    case "country_card":
                        parsed[6] = checkParsed(parsed[6], "country_card");
                        break;
                    case "wildcards":
                        parsed[7] = checkParsed(parsed[7], "wildcards");
                        break;
                    default:
                        throw new MapParseException("Unexpected key in map data: " + key);
                        break;
                }
            }
        } catch (Exception e) {
            throw new MapParseException("Invalid map JSON supplied");
        }
    }

    public void parseMapData(int json) throws MapParseException
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
