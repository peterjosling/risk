require('../less/main.less');

import View = require('./view');
import Model = require('./model');
import Game = require('./game');
import ConnectionView = require('./connection-view');
import LobbyView = require('./lobby-view');
import GameView = require('./game-view');

class App extends View<Model> {
	template = <Function>require('../hbs/app.hbs');
	game : Game;
	view : View<Model>;

	setView(view : View<Model>) : void {
		if (this.view) {
			this.view.destroy();
		}

		this.view = view;
		this.$el.html(this.view.render().el);
	}

	// Show the connection view and allow the user to join a game.
	init() : void {
		this.game = new Game();
		var view = new ConnectionView({model: this.game});
		view.listenTo(this.game, 'connected', this.gameConnected.bind(this));
		app.setView(view);
	}

	// Joined an existing game (or created one). Go to the lobby view.
	gameConnected() : void {
		var view = new LobbyView({model: this.game});
		view.listenTo(this.game, 'gameStart', this.gameStart.bind(this));
		app.setView(view);
	}

	// Game started. Go to main game view.
	gameStart() : void {
		var view = new GameView({model: this.game});
		app.setView(view);
	}
}

var app = new App();
document.body.appendChild(app.render().el);
app.init();

export = app;
