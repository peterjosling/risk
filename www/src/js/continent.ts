import Model = require('./model');
import Collection = require('./collection');
import Territory = require('./territory');

class Continent extends Model {
	territories : Collection<Territory>;

	initialize(options?) {
		this.territories = new Collection<Territory>();
	}

	setValue(value : number) : void {
		this.set('value', value);
	}

	getValue() : number {
		return this.get('value');
	}

	setName(name : string) : void {
		this.set('name', name);
	}

	getName() : string {
		return this.get('name');
	}
}

export = Continent;
