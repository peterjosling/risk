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
		_.forEach(json.continents, function(val : Array<string>, key) {
			var continent = new Continent({id: +key});
			this.continents.add(continent);

			val.forEach(function(territoryId) {
				var territory = new Territory({id: +territoryId});
				continent.territories.add(territory);
				this.territories.add(territory);
			}, this);
		}, this);

		// Set connections between each territory.
		json.connections.forEach(function(connection) {
			var territory1 = this.territories.get(connection[0]);
			var territory2 = this.territories.get(connection[1]);

			territory1.connections.add(territory2);
			territory2.connections.add(territory1);
		}, this);

		// Set continent values.
		json.continent_values.forEach(function(val, key) {
			var continent = this.continents.get(+key);
			continent.setValue(val);
		}, this);

		// Set territory names.
		json.country_names.forEach(function(val, key) {
			var territory = this.territories.get(+key);
			territory.setName(val);
		}, this);

		// Set continent names.
		json.continent_names.forEach(function(val, key) {
			var continent = this.continents.get(+key);
			continent.setName(val);
		}, this);

		// Set territory card types.
		json.country_card.forEach(function(val, key) {
			var territory = this.territories.get(+key);
			territory.setCardType(val);
		}, this);

		// TODO do something with number of wildcards.
	}
}

export = Map;
