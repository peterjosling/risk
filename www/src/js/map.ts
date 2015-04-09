import Model = require('./model');
import Collection = require('./collection');
import Continent = require('./continent');
import Territory = require('./territory');

class Map extends Model {
	continents : Collection<Continent>;
	territories : Collection<Territory>;

	initialize(options) {
		this.continents = new Collection<Continent>();
		this.territories = new Collection<Territory>();
	}

	fromJSON(json) {
		// Create continent/territories structure.
		for (var i in json.continents) {
			var id = +i;
			var continent = new Continent({id: id});
			this.continents.add(continent);

			json.continents[i].forEach(function(territoryId) {
				var territory = new Territory({id: +territoryId});
				continent.territories.add(territory);
				this.territories.add(territory);
			}, this);
		}

		// Set connections between each territory.
		json.connections.forEach(function(connection) {
			var territory1 = this.territories.get(connection[0]);
			var territory2 = this.territories.get(connection[1]);

			territory1.connections.add(territory2);
			territory2.connections.add(territory1);
		}, this);

		// Set continent values.
		for (var i in json.continent_values) {
			var continent = this.continents.get(+i);
			continent.setValue(json.continent_values[i]);
		}

		// Set territory names.
		for (var i in json.country_names) {
			var territory = this.territories.get(+i);
			territory.setName(json.country_names[i]);
		}

		// Set continent names.
		for (var i in json.continent_names) {
			var continent = this.continents.get(+i);
			continent.setName(json.continent_names[i]);
		}

		// Set territory card types.
		for (var i in json.country_card) {
			var territory = this.territories.get(+i);
			territory.setCardType(json.country_card[i]);
		}

		// TODO do something with number of wildcards.
	}
}

export = Map;
