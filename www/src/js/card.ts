import Model = require('./model');
import Territory = require('./territory');

class Card extends Model {
	getType() : string {
		return this.get('type');
	}

	getCountry() : Territory {
		return this.get('territory');
	}
}

export = Card;
