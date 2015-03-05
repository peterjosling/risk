import Model = require('./model');
import Collection = require('./collection');
import Player = require('./player');

var HOST : string = 'ws://localhost';

class Game extends Model {
	private socket : WebSocket;

	public playerList : Collection<Player>;

	constructor(options?) {
		this.playerList = new Collection<Player>();
	}

	connect(host : string, port : number) : Promise<Message> {
		return new Promise<Message>((resolve, reject) => {
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

			this.once('acceptJoinGame', (message : Message) => {
				this.off('rejectJoinGame');
				resolve(message);
			});

			this.once('rejectJoinGame', (message : Message) => {
				this.off('acceptJoinGame');
				reject(message);
			});
		});
	}

	private messageReceived(event : MessageEvent) {
		var message : Message = JSON.parse(event.data);

		switch (message.command) {
			case 'accept_join_game':
				this.acceptJoinGameMessageReceived(<AcceptJoinGameMessage>message);
				break;

			case 'reject_join_game':
				this.rejectJoinGameMessageReceived(<RejectJoinGameMessage>message);
				break;

			case 'players_joined':
				this.playersJoinedMessageReceived(<PlayersJoinedMessage>message);
				break;

			case 'ping':
				this.pingMessageReceived(<PingMessage>message);
				break;

			case 'initialise_game':
				this.initialiseGameMessageReceived(<InitialiseGameMessage>message);
				break;
		}
	}

	private sendMessage(json : Message) {
		this.socket.send(JSON.stringify(json));
	}

	private acceptJoinGameMessageReceived(message : AcceptJoinGameMessage) {
		this.trigger('acceptJoinGame', message);
	}

	private rejectJoinGameMessageReceived(message : RejectJoinGameMessage) {
		this.trigger('rejectJoinGame', message);
	}

	private playersJoinedMessageReceived(message : PlayersJoinedMessage) {
		message.payload.forEach((playerInfo : Array<number, string>) => {
			this.playerList.add({
				player_id: playerInfo[0],
				name: playerInfo[1]
			});
		}, this);
	}

	private pingMessageReceived(message : PingMessage) {
		// Ignore pings from non-player hosts.
		if (message.player_id === null) {
			return;
		}

		var player : Player = this.playerList.get(message.player_id);
		player.setIsActive(true);
	}

	private initialiseGameMessageReceived(message : InitialiseGameMessage) {
		this.set({
			version: message.payload.version,
			features: message.payload.supported_features
		});
	}

	private rollResultMessageReceived(message : RollResultMessage) {

	}
}

export = Game;
