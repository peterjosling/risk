import View = require('./view');
import Player = require('./player');

class PlayerListItemView extends View<Player> {
	template = <Function>require('../hbs/player-list-item-view.hbs');

	get className() {
		return 'player-list-item';
	}

	constructor(options?) {
		super(options);
		this.listenTo(this.model, 'change', this.render);
	}

	getRenderData() {
		var data = this.model.toJSON();
		data.colour = this.model.getColour();
		return data;
	}
}

export = PlayerListItemView
