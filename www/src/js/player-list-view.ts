import View = require('./view');
import Player = require('./player');
import PlayerListItemView = require('./player-list-item-view');

class PlayerListView extends View<Player> {
	template = <Function>require('../hbs/player-list-view.hbs');

	constructor(options?) {
		super(options)
	}

	render(data?: any) : PlayerListView {
		super.render();

		this.collection.forEach(player => {
			var view = new PlayerListItemView({model: player});
			this.listViews.push(view);
			this.$el.append(view.render().el);
		});

		return this;
	}
}

export = PlayerListView;
