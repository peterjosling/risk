import View = require('./view');
import Game = require('./game');
import PlayerListView = require('./player-list-view');
import MapView = require('./map-view');
import Messages = require('./messages');
import ArmyCountSelectView = require('./army-count-select-view');

class GameView extends View<Game> {
	template = <Function>require('../hbs/game-view.hbs');

	armyCountSelectView : ArmyCountSelectView;
	message : Messages.Message;
	deployableArmies : number = 0;

	get className() {
		return 'game';
	}

	constructor(options?) {
		super(options);

		var playerListView = new PlayerListView({ model: this.model });
		var mapView = new MapView({model: this.model});
		this.armyCountSelectView = new ArmyCountSelectView();

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
			},
			{
				view: this.armyCountSelectView,
				el: '#army-count-select'
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

		if (this.model.getPhase() === 'setup') {
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
		} else {
			this.model.setPhase('cards');
			this.deployableArmies = this.model.getNewPlayerArmies();

			if (this.model.playerCards.canTradeInCards()) {
				// TODO show card trade in confirmation, or force it, or don't.
				// TODO add the values of traded in hands to deployableArmies.
			} else {
				this.model.setPhase('deploy');
			}
		}

		// TODO highlight territories which can be selected.
	}

	territorySelected(id : number) {
		var territory = this.model.map.territories.get(id);

		// Only perform an action on the correct turn.
		// TODO also allow actions to be performed when defending.
		if (this.model.getCurrentPlayer() !== this.model.self) {
			return;
		}

		var phase = this.model.getPhase();

		if (phase === 'setup') {
			// Check this territory can be selected.
			var allTerritoriesClaimed = this.model.map.territories.every(territory => {
				return territory.getOwner() !== null;
			});

			// Check this territory can be selected.
			if (!allTerritoriesClaimed && territory.getOwner() !== null) {
				this.model.showToast('This territory has already been claimed.');
				return;
			} else if (allTerritoriesClaimed && territory.getOwner() !== this.model.self) {
				this.model.showToast('You do not own this territory.');
				return;
			}

			var message : Messages.SetupMessage = {
				command: 'setup',
				payload: id,
				player_id: <number>this.model.self.id
			};

			this.model.handleSetupMessage(message);
			this.model.sendMessage(message);

			// Turn complete.
			this.model.nextTurn();
		} else if (phase === 'deploy') {
			// Check this territory can be selected.
			if (territory.getOwner() !== this.model.self) {
				this.model.showToast('You do not own this territory.');
				return;
			}

			if (!this.message || this.message.command !== 'deploy') {
				this.message = <Messages.DeployMessage>({
					command: 'deploy',
					payload: [],
					player_id: this.model.self.id
				});
			}

			// Get how many armies to deploy, add this deployment to the message payload
			this.armyCountSelectView.setMin(1);
			this.armyCountSelectView.setMax(this.deployableArmies);
			this.armyCountSelectView.off('select');
			this.armyCountSelectView.on('select', armies => {
				(<Messages.DeployMessage>this.message).payload.push([id, armies]);
				this.deployableArmies -= armies;

				if (this.deployableArmies === 0) {
					this.model.sendMessage(this.message);
					this.model.setPhase('attack');
					// TODO
				}
			});

			this.armyCountSelectView.show();
		}
	}
}

export = GameView;
