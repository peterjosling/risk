package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map.Entry;
import com.google.gson.*;

public class MapParser {
	// Sample map here
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

	private List<Continent> continents;
	private List<Territory> territories;

	public MapParser(String jsonMap) throws MapParseException
	{
		parseMapData(jsonMap);
	}

	// I like allocating things that won't be used
	private class KeyValue {
		public int key;
		public int value;
		public List<Integer> value_arr = new ArrayList<Integer>();
		public String value_str;
		public List<String> value_str_arr = new ArrayList<String>();
	}

	private class ParsedJson {
		public List<KeyValue> continents = new ArrayList<KeyValue>();
		public List<KeyValue> connections = new ArrayList<KeyValue>();
		public List<KeyValue> continent_values = new ArrayList<KeyValue>();
		public List<KeyValue> continent_names = new ArrayList<KeyValue>();
		public List<KeyValue> country_names = new ArrayList<KeyValue>();
		public List<KeyValue> country_card = new ArrayList<KeyValue>();
		public int wildcards = -1;
	}

	private void parseKeyValArr(JsonElement value, List<KeyValue> value_arr) throws MapParseException
	{
		if (!value.isJsonObject())
			throw new MapParseException("Sub-key is not a JSON object");

		JsonObject joo = value.getAsJsonObject();
		for (Entry<String, JsonElement> je : joo.entrySet()) {
			int ikey;
			JsonElement value2 = je.getValue();

			try {
				ikey = Integer.parseInt(je.getKey());
				if (ikey < 0)
					throw new MapParseException("Sub-entry key cannot be less than 0");
			} catch (Exception e) {
				throw new MapParseException("Sub-entry key is not an integer (" + je.getKey() + ")");
			}

			KeyValue k = new KeyValue();
			k.key = ikey;

			if (!value2.isJsonArray())
				throw new MapParseException("Sub-entry for key " + je.getKey() + " is not a JSON array");

			JsonArray ja = value.getAsJsonArray();
			for (JsonElement jew : ja) {
				try {
					int valasint = jew.getAsInt();

					if (valasint < 0)
						throw new MapParseException("Array sub-entry cannot be less than 0");

					k.value_arr.add(valasint);
				} catch (Exception e) {
					throw new MapParseException("Array sub-entry is not an int");
				}
			}

			value_arr.add(k);
		}
	}

	private void parseKeyVal(JsonElement value, List value_arr, boolean isString) throws MapParseException
	{
		if (!value.isJsonObject())
			throw new MapParseException("Sub-key is not a JSON object");

		JsonObject joo = value.getAsJsonObject();
		for (Entry<String, JsonElement> je : joo.entrySet()) {
			int ikey;
			JsonElement value2 = je.getValue();

			try {
				ikey = Integer.parseInt(je.getKey());
				if (ikey < 0)
					throw new MapParseException("Sub-entry key cannot be less than 0");
			} catch (Exception e) {
				throw new MapParseException("Sub-entry key is not an integer (" + je.getKey() + ")");
			}

			KeyValue k = new KeyValue();
			k.key = ikey;

			if (isString) {
				k.value_str_arr.add(value2.getAsString());
			} else {
				try {
					int valasint = value2.getAsInt();

					if (valasint < 0)
						throw new MapParseException("Array sub-entry cannot be less than 0");

					k.value_arr.add(valasint);
				} catch (Exception e) {
					throw new MapParseException("Array sub-entry is not a string");
				}
			}

			value_arr.add(k);
		}
	}

	private void parseMapData(String json) throws MapParseException
	{
		JsonParser jp = new JsonParser();
		JsonElement je;
		JsonObject jo;
		List<String> lookup = new ArrayList<String>(Arrays.asList("data", "continents", "connections", "continent_values", "continent_names", "country_name", "country_card", "wildcards"));
		boolean[] processed = new boolean[lookup.size()];
		ParsedJson parsed = new ParsedJson();

		try {
			je = jp.parse(json);
			jo = je.getAsJsonObject();
		} catch (Exception e) {
			throw new MapParseException("Malformed JSON supplied");
		}

		try {
			for (Entry<String, JsonElement> jee : jo.entrySet()) {
				String key = jee.getKey();
				JsonElement value = jee.getValue();
				int index = lookup.indexOf(key);

				if (processed[index])
					throw new MapParseException("Already processed " + key);

				processed[index] = true;

				switch (index) {
					case 0: // data key
						try {
							if (!value.getAsString().equals("map"))
								throw new MapParseException("Datatype is not a map");
						} catch (Exception e) {
							throw new MapParseException("Datatype is not a string");
						}
						break;
					case 1: // continents key
						parseKeyValArr(value, parsed.continents);
						break;
					case 2: // connections key
						parseKeyValArr(value, parsed.connections);
						break;
					case 3: // continent_values key
						parseKeyVal(value, parsed.continent_values, false);
						break;
					case 4: // continent_names
						parseKeyVal(value, parsed.continent_names, true);
						break;
					case 5: // country names
						parseKeyVal(value, parsed.country_names, true);
						break;
					case 6:
						parseKeyVal(value, parsed.country_card, true);
						break;
					case 7:
						try {
							parsed.wildcards = value.getAsInt();

							if (parsed.wildcards < 0)
								throw new MapParseException("Wildcards cannot be negative");
						} catch (Exception e) {
							throw new MapParseException("Wildcard type is not an int");
						}
						break;
					default:
						throw new MapParseException("Unexpected key in map data: " + key);
				}
			}
		} catch (Exception e) {
			throw new MapParseException("Invalid map JSON supplied");
		}

		addMapData(parsed);
	}

	private Territory findTerritoryById(int id) throws MapParseException
	{
		for (Territory t : territories)
			if (t.getId() == id)
				return t;

		throw new MapParseException("Territory id was not listed as part of a country");
	}

	// This is much cleaner, I recommend viewing this instead
	private void addMapData(ParsedJson parsedjson) throws MapParseException
	{
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

		// Keeping this in case my proposal doesn't go forward
		/*
		// Loop through the connections and populate the links for each territory
		for (KeyValue pair : parsedjson.connections) {
			// Make quicker using Map<Integer, Territory> ?
			// Currently O(2n * m), not good
			Territory t1 = findTerritoryById(pair.key), t2 = findTerritoryById(pair.value);

			// Add the links bidirectionally
			t1.addLink(t2);
			t2.addLink(t1);
		}
		*/

		// Loop through the connections and populate the links for each territory
		for (KeyValue pair : parsedjson.connections) {
			// More efficient than the previous method
			Territory t1 = findTerritoryById(pair.key);

			for (Integer i : pair.value_arr) {
				Territory t2 = findTerritoryById(i);

				t1.addLink(t2);
				t2.addLink(t1);
			}
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

	public List<Continent> getContinents()
	{
		return continents;
	}

	public List<Territory> getTerritories()
	{
		return territories;
	}
}
