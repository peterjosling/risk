import View = require('./view');
import Player = require('./player');

class PlayerListItemView extends View<Player> {
	template = <Function>require('../hbs/player-list-item-view.hbs');

	constructor(options?) {
		super(options);
		this.listenTo(this.model, 'change', this.render);
	}
}

export = PlayerListItemView
