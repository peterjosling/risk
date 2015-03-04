import View = require('./view');
import Game = require('./game');
import PlayerListView = require('./player-list-view');
import MapView = require('./map-view');

class App extends View<Game> {
	template = <Function>require('../hbs/app.hbs');

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

var app = new App();
app.render();
document.body.appendChild(app.el);

export = App;
