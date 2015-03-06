import Model = require('./model');
import Collection = require('./collection');
import Player = require('./player');
import Messages = require('./messages');

var HOST : string = 'ws://localhost';

class Game extends Model {
	private socket : WebSocket;

	public playerList : Collection<Player>;

	constructor(options?) {
		super(options);
		this.playerList = new Collection<Player>();
	}

	connect(host : string, port : number) : Promise<Messages.Message> {
		return new Promise<Messages.Message>((resolve, reject) => {
			// Connect to Game server and attempt to join a game.
			this.socket = new WebSocket(HOST);
			this.socket.onmessage = this.messageReceived.bind(this);
			this.socket.onopen = () => {
				this.sendMessage({
					command: 'connect',
					payload: {
						host: host,
						port: port
					}
				});
			};

			this.once('acceptJoinGame', (message : Messages.Message) => {
				this.off('rejectJoinGame');
				resolve(message);
			});

			this.once('rejectJoinGame', (message : Messages.Message) => {
				this.off('acceptJoinGame');
				reject(message);
			});
		});
	}

	private messageReceived(event : MessageEvent) {
		var message : Messages.Message = JSON.parse(event.data);

		switch (message.command) {
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
		}
	}

	private sendMessage(json : Messages.Message) {
		this.socket.send(JSON.stringify(json));
	}

	private acceptJoinGameMessageReceived(message : Messages.AcceptJoinGameMessage) {
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
	}

	private rollResultMessageReceived(message : Messages.RollResultMessage) {

	}
}

export = Game;
