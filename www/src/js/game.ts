import Model = require('./model');
import Collection = require('./collection');
import Player = require('./player');
import PlayerList = require('./player-list');
import Messages = require('./messages');
import Map = require('./map');
import CardList = require('./card-list');

var defaultMapJson = require('../../default-map.json');

var HOST : string = 'ws://localhost:7574';

class Game extends Model {
	private socket : WebSocket;

	playerList : PlayerList;
	self : Player;
	map : Map = new Map();
	playerCards : CardList = new CardList();
	_isHost : boolean;
	_phase : string = 'setup';
	cardDrawn : boolean;
	cardsTradedIn : number = 0;

	attackDetails : {
		attack: Messages.AttackMessage
		defend: Messages.DefendMessage
		rolls: Array<Messages.RollResultMessage>
	};

	constructor(options?) {
		super(options);
		this.playerList = new PlayerList();
		this.map.fromJSON(defaultMapJson);
		this.set('currentPlayer', -1);
	}

	// Whether the game is running as a host or not.
	isHost() : boolean {
		return this._isHost;
	}

	// Get the Player instance whose turn it currently is.
	getCurrentPlayer() : Player {
		var playerId : number = this.get('currentPlayer');
		return this.playerList.get(playerId);
	}

	// Get the ID of the player whose turn it currently is.
	getCurrentPlayerId() : number {
		return this.get('currentPlayer');
	}

	// Get the current game phase. 'setup', 'cards', 'deploy', 'attack' or 'defend'.
	getPhase() : string {
		return this._phase;
	}

	// Set the current game phase.
	setPhase(phase : string) {
		var validPhases = ['setup', 'cards', 'deploy', 'attack', 'defend'];

		if (validPhases.indexOf(phase) === -1) {
			throw new Error('Invalid phase specified');
		}

		this._phase = phase;
	}

	// Advance to the next (active) player's turn.
	nextTurn() {
		var player;

		do {
			var id = this.getCurrentPlayerId() + 1;

			if (id === this.playerList.length) {
				id = 0;
			}

			player = this.playerList.get(id);
		} while (!player.isActive);

		// Exit the setup phase if all armies have been assigned.
		if (this._phase === 'setup') {
			var activePlayers = this.playerList.getActivePlayerCount();
			var armyCount = 50 - activePlayers * 5;

			var allArmiesAssigned = this.playerList.every(player => player.getArmies() === armyCount);

			if (allArmiesAssigned) {
				this._phase = 'cards';
			}
		}

		this.cardDrawn = false;
		this.set('currentPlayer', id);
	}

	// Calculate how many new armies the player is going to receive.
	getNewPlayerArmies() : number {
		// Calculate the number of armies received for territories.
		var territoryCount = this.self.getTerritories();
		var armies = Math.floor(territoryCount / 3);

		// Calculate the number of armies received for continents.
		this.map.continents.forEach(continent => {
			var continentOwned = continent.territories.every(territory => {
				return territory.getOwner() === this.self;
			});

			if (continentOwned) {
				armies += continent.getValue();
			}
		});

		// Each player always receives a minimum of 3 armies.
		if (armies < 3) {
			armies = 3;
		}

		return armies;
	}

	// Calculate how many new armies are received for the nth set of cards traded.
	getCardArmies() : number {
		var n = ++this.cardsTradedIn;

		if (n < 6) {
			return 2 * n + 2;
		}

		return  5 * n - 15;
	}

	// Connect to a host server on the specified host and port.
	connect(host : string, port : number, ai : boolean) : Promise<Messages.Message> {
		this._isHost = false;

		return new Promise<Messages.Message>((resolve, reject) => {
			// Connect to Game server and attempt to join a game.
			this.socket = new WebSocket(HOST);
			this.socket.onmessage = this.messageReceived.bind(this);
			this.socket.onopen = () => {
				this.sendMessage({
					command: 'server_connect',
					payload: {
						hostname: host,
						port: port,
						ai: ai
					}
				});
			};

			this.socket.onerror = (error) => {
				reject(error);
			};

			this.once('acceptJoinGame', (message : Messages.Message) => {
				this.off('rejectJoinGame');
				this.trigger('connected');
				resolve(message);
			});

			this.once('rejectJoinGame', (message : Messages.Message) => {
				this.off('acceptJoinGame');
				reject(message);
			});
		});
	}

	// Start a host server on the specified port.
	startServer(port : number) : Promise<Messages.Message> {
		this._isHost = true;

		this.self = new Player({
			player_id: 0,
			isActive: true,
			name: 'TODO Implement player names'
		});

		this.playerList.add(this.self);

		return new Promise<Messages.Message>((resolve, reject) => {
			this.socket = new WebSocket(HOST);
			this.socket.onmessage = this.messageReceived.bind(this);
			this.socket.onopen = () => {
				this.sendMessage({
					command: 'server_start',
					payload: {
						port: port
					}
				});

				// TODO check the host could actually listen on that port before resolving.
				this.trigger('connected');
				resolve();
			};

			this.socket.onerror = (error) => {
				reject(error);
			};
		});
	}

	// Show a toast-style text message to the user.
	showToast(message : string, persistent? : boolean) {
		this.trigger('toast', message, persistent);
	}

	// Read army/territory counts from every territory and update each player's count.
	updateArmyCounts() : void {
		// Initialise array of army/territory counts to 0.
		var armyCounts = this.playerList.map(function(player) {
			return 0;
		});

		var territoryCounts = armyCounts.slice(0);

		// Sum up counts from every territory.
		this.map.territories.forEach(function(territory) {
			var player = territory.getOwner();

			if (!player) {
				return;
			}

			territoryCounts[player.id]++;
			armyCounts[player.id] += territory.getArmies();
		});

		// Update counts on each player.
		this.playerList.forEach(function(player) {
			player.setArmies(armyCounts[player.id]);
			player.setTerritories(territoryCounts[player.id]);
		});
	}

	// Handle a message received from the websocket.
	private messageReceived(event : MessageEvent) {
		var message : Messages.Message = JSON.parse(event.data);

		switch (message.command) {
			case 'join_game':
				this.joinGameMessageReceived(<Messages.JoinGameMessage>message);
				break;

			case 'accept_join_game':
				this.acceptJoinGameMessageReceived(<Messages.AcceptJoinGameMessage>message);
				break;

			case 'reject_join_game':
				this.rejectJoinGameMessageReceived(<Messages.RejectJoinGameMessage>message);
				break;

			case 'players_joined':
				this.playersJoinedMessageReceived(<Messages.PlayersJoinedMessage>message);
				break;

			case 'ping':
				this.pingMessageReceived(<Messages.PingMessage>message);
				break;

			case 'initialise_game':
				this.initialiseGameMessageReceived(<Messages.InitialiseGameMessage>message);
				break;

			case 'setup':
				this.setupMessageReceived(<Messages.SetupMessage>message);
				break;

			case 'attack':
				this.attackMessageReceived(<Messages.AttackMessage>message);
				break;

			case 'defend':
				this.defendMessageReceived(<Messages.DefendMessage>message);
				break;

			case 'attack_capture':
				this.attackCaptureMessageReceived(<Messages.AttackCaptureMessage>message);
				break;

			case 'deploy':
				this.deployMessageReceived(<Messages.DeployMessage>message);
				break;

			case 'roll_result':
				this.rollResultMessageReceived(<Messages.RollResultMessage>message);
				break;

			case 'fortify':
				this.fortifyMessageReceived(<Messages.FortifyMessage>message);
				break;

			case 'play_cards':
				this.playCardsMessageReceived(<Messages.PlayCardsMessage>message);
				break;
		}
	}

	// Send a message down the websocket.
	sendMessage(json : Messages.Message) {
		this.socket.send(JSON.stringify(json));
	}

	private joinGameMessageReceived(message : Messages.JoinGameMessage) {
		this.trigger('playerJoinRequested', message);
	}

	private acceptJoinGameMessageReceived(message : Messages.AcceptJoinGameMessage) {
		this.self = new Player({
			player_id: message.payload.player_id,
			isActive: true,
			name: 'TODO Implement player names'
		});

		this.playerList.add(this.self);
		this.trigger('acceptJoinGame', message);
	}

	private rejectJoinGameMessageReceived(message : Messages.RejectJoinGameMessage) {
		this.trigger('rejectJoinGame', message);
	}

	private playersJoinedMessageReceived(message : Messages.PlayersJoinedMessage) {
		message.payload.forEach((playerInfo) => {
			var player = new Player({
				player_id: playerInfo[0],
				name: playerInfo[1]
			});

			this.playerList.add(player);
		}, this);
	}

	private pingMessageReceived(message : Messages.PingMessage) {
		// Ignore pings from non-player hosts.
		if (message.player_id === null) {
			return;
		}

		var player : Player = this.playerList.get(message.player_id);
		player.isActive = true;
	}

	private initialiseGameMessageReceived(message : Messages.InitialiseGameMessage) {
		this.set({
			version: message.payload.version,
			features: message.payload.supported_features
		});

		this.trigger('gameStart');
	}

	private setupMessageReceived(message : Messages.SetupMessage) {
		var player = this.playerList.get(message.player_id);
		var territory = this.map.territories.get(message.payload);

		// Tell the user what happened.
		var toast = player.name + ' claimed ' + territory.getName();

		if (territory.getOwner()) {
			toast = player.name + ' reinforced ' + territory.getName();
		}

		this.showToast(toast);
		this.handleSetupMessage(message);
		this.nextTurn();
	}

	public handleSetupMessage(message : Messages.SetupMessage) {
		var player = this.playerList.get(message.player_id);
		var territory = this.map.territories.get(message.payload);

		// Claim/reinforce the specified territory.
		territory.setOwner(player);
		territory.addArmies(1);

		this.updateArmyCounts();

		// Trigger change to update the map view.
		this.trigger('change:map');
	}

	private attackMessageReceived(message : Messages.AttackMessage) {
		var sourceId = message.payload[0];
		var destId = message.payload[1];
		var armyCount = message.payload[2];

		var source = this.map.territories.get(sourceId);
		var dest = this.map.territories.get(destId);

		var sourcePlayer = this.playerList.get(message.player_id);
		var destPlayer = dest.getOwner();
		var destPlayerName = destPlayer.name;

		if (destPlayer === this.self) {
			destPlayerName = 'you';
		}

		this.showToast(sourcePlayer.name + ' is attacking ' + dest.getName() + ' (' + destPlayerName + ') from ' + source.getName() + ' with ' + armyCount + ' armies!');
		this.handleAttackMessage(message, destPlayer === this.self);
	}

	public handleAttackMessage(message : Messages.AttackMessage, isLocalPlayer : boolean) {
		if (isLocalPlayer) {
			this.trigger('defend', message.payload);
		}

		this.attackDetails = {
			attack: message,
			defend: null,
			rolls: []
		};
	}

	private defendMessageReceived(message : Messages.DefendMessage) {
		var player = this.playerList.get(message.player_id);
		this.showToast(player.name + ' is defending with ' + message.payload + ' armies.');
		this.handleDefendMessage(message);
	}

	public handleDefendMessage(message : Messages.DefendMessage) {
		this.attackDetails.defend = message;
	}

	private attackCaptureMessageReceived(message : Messages.AttackCaptureMessage) {
		var player = this.playerList.get(message.player_id);
		var source = this.map.territories.get(message.payload[0]);
		var dest = this.map.territories.get(message.payload[1]);
		var armies = message.payload[2];

		this.showToast(player.name + ' captured ' + dest.getName() + ' and moved in ' + armies + ' from ' + source.getName());
		this.handleAttackCaptureMessage(message);
	}

	public handleAttackCaptureMessage(message : Messages.AttackCaptureMessage) {
		var source = this.map.territories.get(message.payload[0]);
		var dest = this.map.territories.get(message.payload[1]);
		var armies = message.payload[2];

		source.addArmies(-armies);
		dest.addArmies(armies);

		this.trigger('change:map');
	}

	private deployMessageReceived(message : Messages.DeployMessage) {
		var player = this.playerList.get(message.player_id);

		message.payload.forEach(deployment => {
			var territory = this.map.territories.get(deployment[0]);
			this.showToast(player.name + ' has deployed ' + deployment[1] + ' armies to ' + territory.getName());
		});

		this.handleDeployMessage(message);
	}

	public handleDeployMessage(message : Messages.DeployMessage) {
		message.payload.forEach(deployment => {
			var territory = this.map.territories.get(deployment[0]);
			territory.addArmies(deployment[1]);
		});

		// Update the UI.
		this.trigger('change:map');
		this.updateArmyCounts()
	}

	private rollResultMessageReceived(message : Messages.RollResultMessage) {
		// Handle first roll to set initial player as a special case.
		if (!this.getCurrentPlayer()) {
			this.set('currentPlayer', message.payload);
			var player = this.getCurrentPlayer();
			this.showToast(player.name + ' to play first');
		} else if (!this.map.deck.shuffled) {
			// TODO
		} else {
			this.attackDetails.rolls.push(message);
			var attackRollCount = this.attackDetails.attack.payload[2];
			var defendRollCount = this.attackDetails.defend.payload;

			// If we've got all the dice rolls, calculate the result.
			if (this.attackDetails.rolls.length === attackRollCount + defendRollCount) {
				var rolls = this.attackDetails.rolls;
				var attackRolls = [];
				var defendRolls = [];

				for (var i = 0; i < rolls.length; i++) {
					if (i < attackRollCount) {
						attackRolls.push(rolls[i]);
					} else {
						defendRolls.push(rolls[i]);
					}
				}

				attackRolls.sort();
				defendRolls.sort();

				// Calculate win/lose for each pair of dice.
				var rollNumber = 1;

				while (attackRolls.length && defendRolls.length) {
					var attackMax = attackRolls.pop();
					var defendMax = defendRolls.pop();

					var losingTerritory;

					// Decide which territory won. Defender always wins in a tie.
					if (attackMax > defendMax) {
						losingTerritory = this.attackDetails.attack[1];
					} else {
						losingTerritory = this.attackDetails.attack[0];
					}

					// Remove one army from the losing territory.
					var territory = this.map.territories.get(losingTerritory);
					territory.addArmies(-1);

					// Show the result.
					this.showToast('Roll ' + rollNumber + ': ' + territory.getName() + ' lost an army');

					rollNumber++;
				}

				// Update the UI.
				this.trigger('change:map');
				this.updateArmyCounts();

				// Let the game view create an attack_capture command if the local player won the attack.
				var defendingTerritory = this.map.territories.get(this.attackDetails.attack[1]);
				var attackingPlayer = this.playerList.get(this.attackDetails.attack.payload[0]);

				if (attackingPlayer === this.self && defendingTerritory.getArmies() === 0) {
					this.trigger('attackCapture', this.attackDetails.attack);
				}

				// Take a card for this player if they won the attack.
				if (defendingTerritory.getArmies() === 0 && !this.cardDrawn) {
					this.cardDrawn = true;

					var card = this.map.deck.first();

					if (card) {
						this.map.deck.remove(card);

						if (attackingPlayer === this.self) {
							this.playerCards.add(card);
						}
					}
				}

				// Clear stored attack details.
				this.attackDetails = null;
			}
		}
	}

	private fortifyMessageReceived(message : Messages.FortifyMessage) {
		var player = this.playerList.get(message.player_id);
		var toastMessage;

		if (message.payload) {
			var source = this.map.territories.get(message.payload[0]);
			var dest = this.map.territories.get(message.payload[1]);
			var armies = message.payload[2];

			toastMessage = player.name + ' moved ' + armies + ' armies from ' + source.getName() + ' to ' + dest.getName();
		} else {
			toastMessage = player.name + ' has chosen not to fortify';
		}

		this.showToast(toastMessage);
		this.handleFortifyMessage(message);
	}

	public handleFortifyMessage(message : Messages.FortifyMessage) {
		if (message.payload === null) {
			return;
		}

		var source = this.map.territories.get(message.payload[0]);
		var dest = this.map.territories.get(message.payload[1]);
		var armies = message.payload[2];

		source.addArmies(armies);
		dest.addArmies(-armies);

		// Update the UI.
		this.trigger('change:map');
		this.updateArmyCounts()
	}

	private playCardsMessageReceived(message : Messages.PlayCardsMessage) {
		var player = this.playerList.get(message.player_id);

		if (message.payload !== null) {
			this.showToast(player.name + ' traded in ' + message.payload.cards.length + ' sets of cards');
		}

		this.handlePlayCardsMessage(message);
	}

	public handlePlayCardsMessage(message : Messages.PlayCardsMessage) {
		if (message.payload !== null) {
			this.cardsTradedIn += message.payload.cards.length;
		}
	}
}

export = Game;
