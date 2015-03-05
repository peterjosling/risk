import Model = require('./model');

class Player extends Model {
	idAttribute = 'player_id';
	defaults = <any>{
		isActive: false
	};

	getPlayerId() : number {
		return this.get('player_id');
	}

	getName() : string {
		return this.get('name');
	}

	isActive() : boolean {
		return this.get('isActive');
	}

	setIsActive(isActive : boolean) : void {
		this.set('isActive', isActive);
	}
}

export = Player;
