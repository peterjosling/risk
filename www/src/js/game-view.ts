import View = require('./view');
import Game = require('./game');
import PlayerListView = require('./player-list-view');
import MapView = require('./map-view');

class GameView extends View<Game> {
	template = <Function>require('../hbs/game-view.hbs');

	constructor(options?) {
		super(options);

		this.childViews = [
			{
				view: new PlayerListView({ collection: this.model.playerList }),
				el: '#player-list'
			},
			{
				view: new MapView(),
				el: '#map'
			}
		];
	}
}

export = GameView;
