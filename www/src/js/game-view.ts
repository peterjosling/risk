import View = require('./view');
import Game = require('./game');
import PlayerListView = require('./player-list-view');
import MapView = require('./map-view');
import Messages = require('./messages');

class GameView extends View<Game> {
	template = <Function>require('../hbs/game-view.hbs');

	get className() {
		return 'game';
	}

	constructor(options?) {
		super(options);

		var playerListView = new PlayerListView({ model: this.model });
		var mapView = new MapView({model: this.model});

		this.listenTo(mapView, 'territorySelect', this.territorySelected);
		this.listenTo(this.model, 'change:currentPlayer', this.currentPlayerChange);

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

	currentPlayerChange() {
		var player = this.model.getCurrentPlayer();

		if (player === this.model.self) {
			this.startTurn()
		} else {
			// TODO end turn
			this.model.showToast(player.name + '\'s turn');
		}
	}

	startTurn() {
		this.model.showToast('Your turn!');

		// Check if we're in the setup phase.
		var allTerritoriesClaimed = this.model.map.territories.every(territory => {
			return territory.getOwner() !== null;
		});

		var toastMessage;

		if (allTerritoriesClaimed) {
			toastMessage = 'Select a territory to reinforce...';
		} else {
			toastMessage = 'Select a territory to claim...';
		}

		this.model.showToast(toastMessage);

		// TODO highlight territories which can be selected.
	}

	territorySelected(id : number) {
		// TODO check this territory can be selected.
		// Only perform an action on the correct turn.
		// TODO also allow actions to be performed when defending.
		if (this.model.getCurrentPlayer() !== this.model.self) {
			return;
		}

		if (this.model.getPhase() === 'setup') {
			var message : Messages.SetupMessage = {
				command: 'setup',
				payload: id,
				player_id: <number>this.model.self.id
			};

			this.model.handleSetupMessage(message);
			this.model.sendMessage(message);

			// Turn complete.
			this.model.nextTurn();
		}
	}
}

export = GameView;
