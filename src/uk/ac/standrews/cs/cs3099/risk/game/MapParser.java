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
	private Deck deck;

	public MapParser(String jsonMap) throws MapParseException
	{
		boolean b = false;

		try {
			parseMapData(jsonMap);
		} catch (MapParseException e) {
			b = true;
			Logger.print(e.getMessage());
		}

		if (b)
			throw new MapParseException("ok");
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

			JsonArray ja = value2.getAsJsonArray();
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

	private void parseKeyVal(JsonElement value, List<KeyValue> value_arr, boolean isString) throws MapParseException
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
				k.value_str = value2.getAsString();
			} else {
				try {
					int valasint = value2.getAsInt();

					if (valasint < 0)
						throw new MapParseException("Array sub-entry cannot be less than 0");

					k.value = valasint;
				} catch (Exception e) {
					throw new MapParseException("Array sub-entry is not a string");
				}
			}

			value_arr.add(k);
		}
	}

	private KeyValue findKeyValuePair(List<KeyValue> list, int id) throws MapParseException
	{
		for (KeyValue pair : list)
			if (pair.key == id)
				return pair;

		KeyValue ret = new KeyValue();
		ret.key = id;
		list.add(ret);

		return ret;
	}

	private void parseArrPair(JsonElement value, List<KeyValue> value_arr) throws MapParseException
	{
		if (!value.isJsonArray())
			throw new MapParseException("Sub-key is not a JSON object");

		JsonArray joo = value.getAsJsonArray();
		for (JsonElement je : joo) {
			int src, dst;
			JsonArray value2;

			try {
				value2 = je.getAsJsonArray();
			} catch (Exception e) {
				throw new MapParseException("Sub-entry in array is not a JSON array");
			}

			if (value2.size() != 2)
				throw new MapParseException("Found an array pair of incorrect length");

			try {
				src = value2.get(0).getAsInt();
				dst = value2.get(1).getAsInt();

				if (src < 0)
					throw new MapParseException("Sub-entry src key cannot be less than 0");

				if (dst < 0)
					throw new MapParseException("Sub-entry dst key cannot be less than 0");
			} catch (Exception e) {
				throw new MapParseException("Array pair entry is not an integer");
			}

			KeyValue k = findKeyValuePair(value_arr, src);
			k.value_arr.add(dst);
		}
	}

	private void parseMapData(String json) throws MapParseException
	{
		JsonParser jp = new JsonParser();
		JsonElement je;
		JsonObject jo;
		List<String> lookup = new ArrayList<String>(Arrays.asList("data", "continents", "connections", "continent_values", "continent_names", "country_names", "country_card", "wildcards"));
		boolean[] processed = new boolean[lookup.size()];
		ParsedJson parsed = new ParsedJson();

		try {
			je = jp.parse(json);
			jo = je.getAsJsonObject();
		} catch (Exception e) {
			throw new MapParseException("Malformed JSON supplied");
		}

		if (jo.entrySet().size() == 0)
			throw new MapParseException("Empty JSON supplied");

		try {
			for (Entry<String, JsonElement> jee : jo.entrySet()) {
				String key = jee.getKey();
				JsonElement value = jee.getValue();
				int index = lookup.indexOf(key);

				if (index < 0) {
					Logger.print("Found unexpected field in map type: " + key);
					continue;
				}

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
						parseArrPair(value, parsed.connections);
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
						parseKeyVal(value, parsed.country_card, false);
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
		} catch (MapParseException e) {
			throw new MapParseException(e.getMessage());
		} catch (Exception e) {
			throw new MapParseException("Invalid map JSON supplied (" + e.getMessage() + ")");
		}

		for (int i = 0; i < processed.length; i++)
			if (!processed[i])
				throw new MapParseException("Map field missing: " + lookup.get(i));

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

		for (KeyValue pair : parsedjson.continent_names) {
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

			c.setName(pair.value_str);
		}

		for (KeyValue pair : parsedjson.country_names) {
			Territory t = null;

			// Find the continent by id and set its corresponding value
			for (Territory t2 : territories) {
				if (t2.getId() == pair.key) {
					t = t2;
					break;
				}
			}

			if (t == null)
				throw new MapParseException("Territory not previously found (invalid id)");

			t.setName(pair.value_str);
		}

		int max_id = 0;
		Card.CardType[] card_types = {Card.CardType.INFANTRY, Card.CardType.CAVALRY, Card.CardType.ARTILLERY};

		deck = new Deck(parsedjson.country_card.size() + parsedjson.wildcards);

		for (KeyValue pair : parsedjson.country_card) {
			boolean ok = false;

			// Find the territory by id and set its corresponding value
			for (Territory t : territories) {
				if (t.getId() == pair.key) {
					ok = true;
					break;
				}
			}

			if (!ok)
				throw new MapParseException("Territory not previously found (invalid id)");

			deck.addCardToDeck(max_id++, pair.key, card_types[pair.value]);
		}


		for (int i = 0; i < parsedjson.wildcards; i++)
			deck.addCardToDeck(max_id++, -1, Card.CardType.WILD);
	}

	public List<Continent> getContinents()
	{
		return continents;
	}

	public List<Territory> getTerritories()
	{
		return territories;
	}

	public Deck getDeck()
	{
		return deck;
	}
}
