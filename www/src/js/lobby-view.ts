import View = require('./view');
import Game = require('./game');

class LobbyView extends View<Game> {
	template = <Function>require('../hbs/lobby-view.hbs');

	constructor(options?) {
		super(options);
		this.listenTo(this.model.playerList, 'add', this.render);
	}

	getRenderData() {
		return {
			players: this.model.playerList.toJSON()
		}
	}
}

export = LobbyView;
