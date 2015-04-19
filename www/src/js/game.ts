import Model = require('./model');
import Collection = require('./collection');
import Player = require('./player');
import PlayerList = require('./player-list');
import Messages = require('./messages');
import Map = require('./map');

var defaultMapJson = require('../../default-map.json');

var HOST : string = 'ws://localhost:7574';

class Game extends Model {
	private socket : WebSocket;

	playerList : PlayerList;
	self : Player;
	map : Map;
	_isHost : boolean;
	_phase : string = 'setup';

	constructor(options?) {
		super(options);
		this.playerList = new PlayerList();
		this.map = new Map();
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

	// Get the current game phase. 'setup', 'attack' or 'defend'.
	getPhase() : string {
		return this._phase;
	}

	// Advance to the next player's turn.
	nextTurn() {
		var id = this.getCurrentPlayerId() + 1;

		if (id === this.playerList.length) {
			id = 0;
		}

		this.set('currentPlayer', id);
	}

	// Connect to a host server on the specified host and port.
	connect(host : string, port : number) : Promise<Messages.Message> {
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
						port: port
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
	showToast(message : string) {
		this.trigger('toast', message);
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

			case 'deploy':
				this.deployMessageReceived(<Messages.DeployMessage>message);
				break;

			case 'roll_result':
				this.rollResultMessageReceived(<Messages.RollResultMessage>message);
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
		this.handleAttackMessage(message);
	}

	public handleAttackMessage(message : Messages.AttackMessage) {
		// TODO store attack details.
	}

	private defendMessageReceived(message : Messages.DefendMessage) {
		var player = this.playerList.get(message.player_id);
		this.showToast(player.name + ' is defending with ' + message.payload + ' armies.');
		this.handleDefendMessage(message);
	}

	public handleDefendMessage(message : Messages.DefendMessage) {
		// TODO store defend details.
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

		this.updateArmyCounts();
	}

	private rollResultMessageReceived(message : Messages.RollResultMessage) {
		// Handle first roll to set initial player as a special case.
		if (!this.getCurrentPlayer()) {
			this.set('currentPlayer', message.payload);
			var player = this.getCurrentPlayer();
			this.showToast(player.name + ' to play first');
		} else {
			// TODO
		}
	}
}

export = Game;
