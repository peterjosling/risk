import View = require('./view');
import Game = require('./game');
import Messages = require('./messages');
import Player = require('./player');

class LobbyView extends View<Game> {
	template = <Function>require('../hbs/lobby-view.hbs');

	private requestedPlayers : Array<Messages.JoinGameMessage>;

	get events() : any {
		return {
			'click .start-game-button': 'startGameButtonClick'
		}
	}

	constructor(options?) {
		super(options);
		this.listenTo(this.model.playerList, 'add', this.render);
		this.listenTo(this.model, 'playerJoinRequested', this.playerJoinRequested);

		this.requestedPlayers = [];
	}

	getRenderData() {
		return {
			players: this.model.playerList.toJSON(),
			isHost: this.model.isHost()
		}
	}

	playerJoinRequested(message : Messages.JoinGameMessage) {
		//this.requestedPlayers.push(message);
		// TODO get confirmation from user.

		var response : Messages.Message;

		if (this.model.playerList.length === 6) {
			response = <Messages.RejectJoinGameMessage>({
				command: 'reject_join_game',
				payload: 'Game full'
			});
		} else {
			var player = new Player({
				player_id: this.model.playerList.length,
				name: message.payload.name
			});

			this.model.playerList.push(player);

			response = <Messages.AcceptJoinGameMessage>({
				command: 'accept_join_game',
				payload: {
					player_id: player.id,
					acknowledgement_timeout: 0,
					move_timeout: 0
				}
			});
		}

		this.model.sendMessage(response);
	}

	startGameButtonClick() : void {
		if (this.model.playerList.length < 3) {
			this.model.showToast('Not enough players');
			return;
		}

		// TODO host will already be sending this. Probably want to send something else instead to trigger game start.
		var pingCommand = <Messages.PingMessage>({
			command: 'ping',
			player_id: this.model.self.id,
			payload: this.model.playerList.length
		});

		this.model.sendMessage(pingCommand);
		this.$('.start-game-button').remove()
	}
}

export = LobbyView;
