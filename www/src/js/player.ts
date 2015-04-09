import Model = require('./model');

var colours = [
	'#FF2B2B',
	'#2BE0FF',
	'#F6FF2B',
	'#B4EC51',
	'#F5A623',
	'#53A0FD'
];

class Player extends Model {
	constructor(options?) {
		super(options);

		this.defaults = <any>{
			isActive: false
		};
	}

	public get idAttribute() {
		return 'player_id'
	}

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

	getColour() : string {
		return colours[this.playerId];
	}
}

export = Player;
