import Model = require('./model');
import Collection = require('./collection');
import Player = require('./player');

class Territory extends Model {
	connections : Collection<Territory>;
	private owner : Player;

	initialize(options?) {
		this.connections = new Collection<Territory>();
	}

	setName(name : string) : void {
		this.set('name', name);
	}

	getName() : string {
		return this.get('name');
	}

	setCardType(cardType : number) : void {
		this.set('cardType', cardType);
	}

	getCardType() : number {
		return this.get('cardType');
	}

	setOwner(player : Player) : void {
		this.owner = player;
	}

	getOwner() : Player {
		return this.owner;
	}
}

export = Territory;
