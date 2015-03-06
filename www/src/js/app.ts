import View = require('./view');
import Model = require('./model');
import Game = require('./game');
import ConnectionView = require('./connection-view');

class App extends View<Model> {
	template = <Function>require('../hbs/app.hbs');
	game : Game;
	view : View<Model>;

	setView(view : View<Model>) : void {
		this.view.destroy();
		this.view = view;
		this.$el.html(this.view.render().el);
	}
}

var app = new App();
var game = new Game();
var view = new ConnectionView({model: game});
app.render();
app.setView(view);
document.body.appendChild(app.el);

export = app;
