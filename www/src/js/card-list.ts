import Collection = require('./collection');
import Card = require('./card');

class CardList extends Collection<Card> {
	shuffled : boolean = false;
	private shuffleIndex : number = 0;

	// Check if there are any valid sets of cards in this deck.
	canTradeInCards() : boolean {
		var artilleryCount = this.where({type: 'artillery'}).length;
		var cavalryCount = this.where({type: 'cavalry'}).length;
		var infantryCount = this.where({type: 'infantry'}).length;
		var hasWildcards = this.findWhere({type: 'wildcard'}) != null;

		return artilleryCount > 2 || cavalryCount > 2 || infantryCount > 2 || hasWildcards && this.length > 2 || (artilleryCount > 0 && cavalryCount > 0 && infantryCount > 0);
	}

	shuffleWithNumber(n : number) {
		var first = this.at(this.shuffleIndex);
		var second = this.at(n);

		this.models[n] = first;
		this.models[this.shuffleIndex] = second;

		// Increment shuffle position, check if we're done.
		if (++this.shuffleIndex === this.length) {
			this.shuffled = true;
		}
	}
}

export = CardList;
