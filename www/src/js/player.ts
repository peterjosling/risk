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
	get defaults() : any {
		return {
			isActive: false,
			armies: 0,
			territories: 0
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

	setArmies(armies: number) : void {
		this.set('armies', armies);
	}

	getArmies() : number {
		return this.get('armies');
	}

	setTerritories(territories : number) {
		this.set('territories', territories);
	}

	getTerritories() : number {
		return this.get('territories');
	}
}

export = Player;
