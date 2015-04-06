import View = require('./view');
import Player = require('./player');
import PlayerListItemView = require('./player-list-item-view');

class PlayerListView extends View<Player> {
	template = <Function>require('../hbs/player-list-view.hbs');

	constructor(options?) {
		super(options)
	}
}

export = PlayerListView;
