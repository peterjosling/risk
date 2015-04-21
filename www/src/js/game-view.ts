import View = require('./view');
import Game = require('./game');
import PlayerListView = require('./player-list-view');
import MapView = require('./map-view');
import Messages = require('./messages');
import CardSelectView = require('./card-select-view');
import ArmyCountSelectView = require('./army-count-select-view');
import Territory = require('./territory');

class GameView extends View<Game> {
	template = <Function>require('../hbs/game-view.hbs');

	cardSelectView : CardSelectView;
	armyCountSelectView : ArmyCountSelectView;
	message : Messages.Message;
	deployableArmies : number = 0;

	get className() {
		return 'game';
	}

	get events() : any {
		return {
			'click #attack-end-button': 'endAttackPhase',
			'click #no-fortify-button': 'noFortifyButtonClick'
		}
	}

	constructor(options?) {
		super(options);

		var playerListView = new PlayerListView({ model: this.model });
		var mapView = new MapView({model: this.model});
		this.cardSelectView = new CardSelectView({model: this.model});
		this.armyCountSelectView = new ArmyCountSelectView({model: this.model});

		this.listenTo(mapView, 'territorySelect', this.territorySelected);
		this.listenTo(this.model, 'change:currentPlayer', this.currentPlayerChange);
		this.listenTo(this.model, 'defend', this.startDefend);
		this.listenTo(this.model, 'attackCapture', this.getAttackCapture);

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
			},
			{
				view: this.cardSelectView,
				el: '#card-select'
			}
		];
	}

	currentPlayerChange() {
		this.clearHighlightedTerritories();

		var player = this.model.getCurrentPlayer();

		if (player === this.model.self) {
			this.startTurn()
		} else {
			// TODO end turn
			this.model.showToast(player.name + '\'s turn', true);
		}
	}

	// Start the player's turn.
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

			this.model.showToast(toastMessage, true);
		} else {
			this.model.setPhase('cards');
			this.deployableArmies = this.model.getNewPlayerArmies();

			if (this.model.playerCards.canTradeInCards()) {
				this.startCardTrade();
			} else {
				var playCardsMessage : Messages.PlayCardsMessage = {
					command: 'play_cards',
					payload: null,
					player_id: this.model.self.id
				};

				this.model.sendMessage(playCardsMessage);
				this.startDeployPhase();
			}
		}

		this.highlightSelectableTerritories();
	}

	// Show the player the card trade window.
	startCardTrade() {
		var playCardsMessage : Messages.PlayCardsMessage = {
			command: 'play_cards',
			payload: {
				cards: [],
				armies: -1
			},
			player_id: this.model.self.id
		};

		this.cardSelectView.show();
		this.cardSelectView.off('trade');
		this.cardSelectView.off('close');

		// Add each set of cards to the command.
		this.cardSelectView.on('trade', cards => {
			this.model.playerCards.remove(cards);
			playCardsMessage.payload.cards.push(cards);
		});

		this.cardSelectView.on('close', () => {
			var cards = playCardsMessage.payload.cards;

			if (cards.length === 0) {
				playCardsMessage.payload = null;
			} else {
				// Get the value of the cards traded in.
				for (var i = 0; i < cards.length; i++) {
					this.deployableArmies += this.model.getCardArmies();
				}

				// Check if any of the cards traded in match an owned territory.
				var bonusTerritory = null;

				cards.forEach(set => {
					set.forEach(card => {
						var territory = card.getTerritory();

						if (territory.getOwner() === this.model.self) {
							bonusTerritory = territory;
						}
					});
				});

				// Automatically deploy bonus armies to one of the matched territories.
				if (bonusTerritory) {
					this.message = <Messages.DeployMessage>({
						command: 'deploy',
						payload: [[bonusTerritory.id, 2]],
						player_id: this.model.self.id
					});

					bonusTerritory.addArmies(2);
					this.model.trigger('change:map');
					this.model.updateArmyCounts();
				}
			}

			this.model.sendMessage(playCardsMessage);
			this.startDeployPhase();
		});
	}

	// Handle a territory being selected in the interface.
	territorySelected(id : number) {
		var territory = this.model.map.territories.get(id);

		// Only perform an action on the correct turn.
		if (this.model.getCurrentPlayer() !== this.model.self) {
			return;
		}

		var phase = this.model.getPhase();

		if (phase === 'setup') {
			this.territorySelectedSetup(territory)
		} else if (phase === 'deploy') {
			this.territorySelectedDeploy(territory);
		} else if (phase === 'attack') {
			this.territorySelectedAttack(territory);
		} else if (phase === 'fortify') {
			this.territorySelectedFortify(territory);
		}
	}

	// Handle territory selection in the setup phase.
	territorySelectedSetup(territory : Territory) {
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
			payload: territory.id,
			player_id: <number>this.model.self.id
		};

		this.model.handleSetupMessage(message);
		this.model.sendMessage(message);

		// Turn complete.
		this.model.nextTurn();
	}

	// Handle territory selection in the deploy phase.
	territorySelectedDeploy(territory : Territory) {
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
			(<Messages.DeployMessage>this.message).payload.push([territory.id, armies]);
			this.deployableArmies -= armies;

			// Update map.
			territory.addArmies(armies);
			this.model.updateArmyCounts();
			this.model.trigger('change:map');
			this.model.showToast('Select one or more territories to deploy your new armies to. You have ' + this.deployableArmies + ' armies.', true);

			if (this.deployableArmies === 0) {
				this.model.sendMessage(this.message);
				this.model.setPhase('attack');
				this.startAttackPhase();
			}
		});

		this.armyCountSelectView.show();
	}

	// Handle territory selection in the attack phase.
	territorySelectedAttack(territory : Territory) {
		if (this.message === null) {
			// Check this territory can be selected.
			if (territory.getOwner() !== this.model.self) {
				this.model.showToast('You do not own this territory');
				return;
			}

			if (territory.getArmies() < 2) {
				this.model.showToast('This territory doesn\'t contain enough armies to attack');
				return;
			}

			this.message = <Messages.AttackMessage>({
				command: 'attack',
				payload: [territory.id],
				player_id: this.model.self.id
			});

			this.model.showToast('Select a territory to attack', true);
			this.highlightSelectableTerritories();
		} else {
			// Check this territory can be selected.
			if (territory.getOwner() === this.model.self) {
				this.model.showToast('You cannot attack your own territory');
				return;
			}

			var sourceId = (<Messages.AttackMessage>this.message).payload[0];
			var sourceTerritory = this.model.map.territories.get(sourceId);

			if (!territory.connections.get(sourceTerritory)) {
				this.model.showToast('This territory is not connected to yours.');
				return;
			}

			// TODO add deselect button.

			(<Messages.AttackMessage>this.message).payload.push(territory.id);

			// Get number of armies to attack with.
			var maxArmies = Math.min(3, sourceTerritory.getArmies() - 1);

			this.armyCountSelectView.setMin(1);
			this.armyCountSelectView.setMax(maxArmies);
			this.armyCountSelectView.off('select');
			this.armyCountSelectView.on('select', armies => {
				(<Messages.AttackMessage>this.message).payload.push(armies);
				this.model.handleAttackMessage(<Messages.AttackMessage>this.message, false);
				this.model.sendMessage(this.message);

				// Reset and get the next attack.
				this.startAttackPhase();
			});

			this.armyCountSelectView.show(true);
		}
	}

	// Handle territory selection in the fortify phase.
	territorySelectedFortify(territory : Territory) {
		if (!this.message) {
			// Check this territory can be selected.
			if (territory.getOwner() !== this.model.self) {
				this.model.showToast('You do not own this territory');
				return;
			}

			if (territory.getArmies() < 2) {
				this.model.showToast('This territory doesn\'t contain enough armies to fortify');
				return;
			}

			this.message = <Messages.FortifyMessage>({
				command: 'fortify',
				payload: [territory.id],
				player_id: this.model.self.id
			});

			this.model.showToast('Select a territory to fortify', true);
			this.highlightSelectableTerritories();
		} else {
			// Check this territory can be selected.
			if (territory.getOwner() !== this.model.self) {
				this.model.showToast('You do not own this territory');
				return;
			}

			var sourceId = (<Messages.FortifyMessage>this.message).payload[0];
			var sourceTerritory = this.model.map.territories.get(sourceId);

			if (!territory.connections.get(sourceTerritory)) {
				this.model.showToast('This territory is not connected to the source');
				return;
			}

			// TODO add deselect button.

			(<Messages.FortifyMessage>this.message).payload.push(territory.id);

			// Get number of armies to attack with.
			var maxArmies = Math.min(3, sourceTerritory.getArmies() - 1);

			this.armyCountSelectView.setMin(1);
			this.armyCountSelectView.setMax(maxArmies);
			this.armyCountSelectView.off('select');
			this.armyCountSelectView.on('select', armies => {
				(<Messages.FortifyMessage>this.message).payload.push(armies);
				this.model.handleFortifyMessage(<Messages.FortifyMessage>this.message);
				this.model.sendMessage(this.message);
				this.message = null;

				this.endTurn();
			});

			this.armyCountSelectView.show(true);
		}
	}

	startDeployPhase() {
		this.model.setPhase('deploy');
		this.model.showToast('Select one or more territories to deploy your new armies to. You have ' + this.deployableArmies + ' armies.', true);
	}

	startAttackPhase() {
		this.$('#attack-end-button').removeClass('hidden');
		this.model.showToast('Select a territory to attack from', true);
		this.message = null;
		this.highlightSelectableTerritories();
	}

	endAttackPhase() {
		this.$('#attack-end-button').addClass('hidden');
		this.$('#no-fortify-button').removeClass('hidden');
		this.model.setPhase('fortify');
		this.model.showToast('Select a territory to move armies from, if you wish to fortify', true);
		this.message = null;
		this.highlightSelectableTerritories();
	}

	getAttackCapture(attack : Messages.AttackMessage) {
		this.model.showToast('You won! Select how many armies you wish to move in to the new territory', true);

		var sourceTerritory = this.model.map.territories.get(attack.payload[0]);

		this.armyCountSelectView.setMin(attack.payload[2]);
		this.armyCountSelectView.setMax(sourceTerritory.getArmies() - 1);
		this.armyCountSelectView.off('select');
		this.armyCountSelectView.on('select', count => {
			var message : Messages.AttackCaptureMessage = {
				command: 'attack_capture',
				payload: [attack.payload[0], attack.payload[1], count],
				player_id: this.model.self.id
			};

			this.model.sendMessage(message);
			this.model.handleAttackCaptureMessage(message);
			this.startAttackPhase();
		});

		this.armyCountSelectView.show(true);
	}

	noFortifyButtonClick() {
		this.$('#no-fortify-button').addClass('hidden');

		var message : Messages.FortifyMessage = {
			command: 'fortify',
			payload: null,
			player_id: this.model.self.id
		};

		this.model.sendMessage(message);
		this.endTurn();
	}

	endTurn() {
		this.model.nextTurn();
	}

	startDefend(payload : Array<number>) {
		var territory = this.model.map.territories.get(payload[0]);
		var maxArmies = Math.min(2, territory.getArmies());

		this.armyCountSelectView.setMin(1);
		this.armyCountSelectView.setMax(maxArmies);
		this.armyCountSelectView.off('select');
		this.armyCountSelectView.on('select', count => {
			var message : Messages.DefendMessage = {
				command: 'defend',
				payload: count,
				player_id: this.model.self.id
			};

			this.model.handleDefendMessage(message);
			this.model.sendMessage(message);
		});

		this.armyCountSelectView.show(true);
	}

	highlightSelectableTerritories() {
		this.clearHighlightedTerritories();

		var invalidTerritories = [];
		var phase = this.model.getPhase();

		if (phase === 'setup') {
			var allTerritoriesClaimed = this.model.map.territories.every(territory => {
				return territory.getOwner() !== null;
			});

			if (!allTerritoriesClaimed) {
				this.model.map.territories.forEach(territory => {
					if (territory.getOwner() !== null) {
						invalidTerritories.push(territory.id);
					}
				});
			} else {
				this.model.map.territories.forEach(territory => {
					if (territory.getOwner() !== this.model.self) {
						invalidTerritories.push(territory.id);
					}
				});
			}
		} else if (phase === 'deploy') {
			this.model.map.territories.forEach(territory => {
				if (territory.getOwner() !== this.model.self) {
					invalidTerritories.push(territory.id);
				}
			})
		} else if (phase === 'attack') {
			if (this.message === null) {
				this.model.map.territories.forEach(territory => {
					if (territory.getOwner() !== this.model.self) {
						invalidTerritories.push(territory.id);
					}
				});
			} else {
				var sourceId = (<Messages.AttackMessage>this.message).payload[0];
				var source = this.model.map.territories.get(sourceId);

				invalidTerritories = this.model.map.territories.map(territory => territory.id);
				source.connections.forEach(territory => {
					if (territory.getOwner() !== this.model.self) {
						invalidTerritories.splice(invalidTerritories.indexOf(territory.id), 1);
					}
				});
			}
		} else if (phase === 'fortify') {
			if (!this.message) {
				this.model.map.territories.forEach(territory => {
					if (territory.getOwner() !== this.model.self) {
						invalidTerritories.push(territory.id);
					}
				});
			} else {
				var sourceId = (<Messages.FortifyMessage>this.message).payload[0];
				var source = this.model.map.territories.get(sourceId);

				invalidTerritories = this.model.map.territories.map(territory => territory.id);
				source.connections.forEach(territory => {
					if (territory.getOwner() === this.model.self) {
						invalidTerritories.splice(invalidTerritories.indexOf(territory.id), 1);
					}
				});
			}
		}

		invalidTerritories.forEach(id => (<HTMLElement>document.querySelector('svg .territory[data-territory-id="' + id + '"]')).classList.add('fade'));
	}

	clearHighlightedTerritories() {
		var territories = document.querySelectorAll('svg .territory.fade');

		for (var i = 0; i < territories.length; i++) {
			(<HTMLElement>territories[i]).classList.remove('fade');
		}
	}
}

export = GameView;
