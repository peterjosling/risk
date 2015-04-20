import Collection = require('./collection');
import Card = require('./card');

class CardList extends Collection<Card> {
	shuffled : boolean = false;

	// Check if there are any valid sets of cards in this deck.
	canTradeInCards() : boolean {
		var artilleryCount = this.where({type: 'artillery'}).length;
		var cavalryCount = this.where({type: 'cavalry'}).length;
		var infantryCount = this.where({type: 'infantry'}).length;
		var hasWildcards = this.findWhere({type: 'wildcard'}) != null;

		return artilleryCount > 2 || cavalryCount > 2 || infantryCount > 2 || hasWildcards && this.length > 2 || (artilleryCount > 0 && cavalryCount > 0 && infantryCount > 0);
	}
}

export = CardList;
