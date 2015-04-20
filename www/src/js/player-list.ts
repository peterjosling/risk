import Collection = require('./collection');
import Player = require('./player');

class PlayerList extends Collection<Player> {
	comparator(player : Player) {
		return player.id;
	}

	getActivePlayerCount() : number {
		return this.reduce((prev, player) => {
			return prev + ((player.isActive) ? 1 : 0);
		}, 0);
	}
}

export = PlayerList;
