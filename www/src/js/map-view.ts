import View = require('./view');
import Game = require('./game');

class MapView extends View<Game> {
	template = <Function>require('../hbs/map-view.hbs')
}

export = MapView;
