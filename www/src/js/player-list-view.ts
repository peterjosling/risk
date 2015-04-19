import View = require('./view');
import Player = require('./player');
import PlayerListItemView = require('./player-list-item-view');
import Game = require('./game');

class PlayerListView extends View<Game> {
	template = <Function>require('../hbs/player-list-view.hbs');

	constructor(options?) {
		super(options);
		this.listenTo(this.model, 'change:currentPlayer', this.updateCurrentPlayer)
	}

	render(data?: any) : PlayerListView {
		super.render();

		this.model.playerList.forEach(player => {
			var view = new PlayerListItemView({model: player});
			this.listViews.push(view);
			this.$('.player-container').append(view.render().el);
		});

		this.updateCurrentPlayer();
		return this;
	}

	updateCurrentPlayer() : void {
		this.$('.current-player-thumb').attr('data-player-id', this.model.getCurrentPlayerId());
	}
}

export = PlayerListView;
