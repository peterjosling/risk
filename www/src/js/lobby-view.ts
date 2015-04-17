import View = require('./view');
import Game = require('./game');
import Messages = require('./messages');
import Player = require('./player');

class LobbyView extends View<Game> {
	template = <Function>require('../hbs/lobby-view.hbs');

	private requestedPlayers : Array<Messages.JoinGameMessage>;

	constructor(options?) {
		super(options);
		this.listenTo(this.model.playerList, 'add', this.render);
		this.listenTo(this.model, 'playerJoinRequested', this.playerJoinRequested);

		this.requestedPlayers = [];
	}

	getRenderData() {
		return {
			players: this.model.playerList.toJSON()
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
				id: this.model.playerList.length,
				name: message.payload.name
			});

			this.model.playerList.push(player);

			response = <Messages.AcceptJoinGameMessage>({
				payload: {
					player_id: player.id,
					acknowledgement_timeout: 0,
					move_timeout: 0
				}
			});
		}

		this.model.sendMessage(response);
	}
}

export = LobbyView;
