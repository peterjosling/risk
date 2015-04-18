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

	public Map(MapParser m)
	{
		continents = m.getContinents();
		territories = m.getTerritories();
	}

	public Map()
	{
		// Just to have country generation
	}

	public List<Continent> getContinents()
	{
		return continents;
	}

	public List<Territory> getTerritories()
	{
		return territories;
	}

	public Territory findTerritoryById(int id)
	{
		for (Territory t : territories)
			if (t.getId() == id)
				return t;

		return null;
	}

	public Continent getContinentById(int id)
	{
		for (Continent continent : continents) {
			if (continent.getId() == id) {
				return continent;
			}
		}

		return null;
	}

	public static Map fromJSON(String json)
	{
		GsonBuilder builder = new GsonBuilder();
		builder.registerTypeAdapter(Map.class, new MapDeserializer());
		return builder.create().fromJson(json, Map.class);
	}

	private static class MapDeserializer implements JsonDeserializer<Map> {
		@Override
		public Map deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException
		{
			JsonObject obj = jsonElement.getAsJsonObject();
			Map map = new Map();
			List<Continent> continents = map.getContinents();
			List<Territory> territories = map.getTerritories();

			JsonObject continentTerritories = obj.get("continents").getAsJsonObject();

			// Create a Continent instance for each continent in the map.
			for (Entry<String, JsonElement> continentEntry : continentTerritories.entrySet()) {
				int id = Integer.parseInt(continentEntry.getKey());
				JsonArray territoryJsonArray = continentEntry.getValue().getAsJsonArray();

				Continent continent = new Continent(id);
				continents.add(continent);

				// Create a Territory instance within this continent for each key in the array.
				for (JsonElement territoryEntry : territoryJsonArray) {
					int territoryId = Integer.parseInt(territoryEntry.getAsString());

					Territory territory = new Territory(territoryId, continent);
					continent.addTerritory(territory);
					territories.add(territory);
				}
			}

			// Setup connections between territories.
			JsonArray connections = obj.get("connections").getAsJsonArray();

			for (JsonElement connectionElement : connections) {
				JsonArray connectionPair = connectionElement.getAsJsonArray();

				Territory territory1 = map.findTerritoryById(connectionPair.get(0).getAsInt());
				Territory territory2 = map.findTerritoryById(connectionPair.get(1).getAsInt());

				territory1.addLink(territory2);
				territory2.addLink(territory1);
			}

			// Assign values to continents.
			JsonObject continentValues = obj.get("continent_values").getAsJsonObject();

			for (Entry<String, JsonElement> valueEntry : continentValues.entrySet()) {
				int continentId = Integer.parseInt(valueEntry.getKey());
				int continentValue = valueEntry.getValue().getAsInt();

				Continent continent = map.getContinentById(continentId);
				continent.setContinentValue(continentValue);
			}

			// Assign names to continents.
			JsonObject continentNames = obj.get("continent_names").getAsJsonObject();

			for (Entry<String, JsonElement> nameEntry : continentNames.entrySet()) {
				int continentId = Integer.parseInt(nameEntry.getKey());
				String continentName = nameEntry.getValue().getAsString();

				Continent continent = map.getContinentById(continentId);
				continent.setName(continentName);
			}

			// Assign names to territories.
			JsonObject territoryNames = obj.get("country_names").getAsJsonObject();

			for (Entry<String, JsonElement> nameEntry : territoryNames.entrySet()) {
				int territoryId = Integer.parseInt(nameEntry.getKey());
				String territoryName = nameEntry.getValue().getAsString();

				Territory territory = map.findTerritoryById(territoryId);
				territory.setName(territoryName);
			}

			// TODO parse deck.

			return map;
		}
	}
}
