import View = require('./view');
import Game = require('./game');
import PlayerListView = require('./player-list-view');
import MapView = require('./map-view');

class GameView extends View<Game> {
	template = <Function>require('../hbs/game-view.hbs');

	get className() {
		return 'game';
	}

	constructor(options?) {
		super(options);

		var playerListView = new PlayerListView({ collection: this.model.playerList });
		var mapView = new MapView({model: this.model});

		this.childViews = [
			{
				view: playerListView,
				el: '#player-list'
			},
			{
				view: mapView,
				el: '#map'
			}
		];
	}
}

export = GameView;
