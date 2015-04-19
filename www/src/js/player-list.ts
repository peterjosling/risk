import Collection = require('./collection');
import Player = require('./player');

class PlayerList extends Collection<Player> {
	comparator(player : Player) {
		return player.id;
	}
}

export = PlayerList;
