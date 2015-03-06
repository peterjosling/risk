import View = require('./view');
import Game = require('./game');
import PlayerListView = require('./player-list-view');
import MapView = require('./map-view');

class GameView extends View<Game> {
	template = <Function>require('../hbs/game-view.hbs');

	childViews = [
		{
			view: new PlayerListView(),
			el: '#player-list'
		},
		{
			view: new MapView(),
			el: '#map'
		}
	];

	constructor(options?) {
		super(options);
	}
}

export = GameView;
