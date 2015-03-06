import Model = require('./model');

class Player extends Model {
	constructor(options?) {
		super(options);
		this.defaults = <any>{
			isActive: false
		};
	}

	idAttribute = 'player_id';

	get playerId() : number {
		return super.get('player_id');
	}

	get name() : string {
		return super.get('name');
	}

	get isActive() : boolean {
		return super.get('isActive');
	}

	set isActive(isActive : boolean) {
		super.set('isActive', isActive);
	}
}

export = Player;
