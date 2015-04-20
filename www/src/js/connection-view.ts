import View = require('./view');
import Game = require('./game');
import Messages = require('./messages');

class ConnectionView extends View<Game> {
	template = <Function>require('../hbs/connection-view.hbs');

	get className() : string {
		return 'connection-view';
	}

	get events() : any {
		return {
			'click .connect-button': 'connectButtonClick',
			'click .host-button': 'hostButtonClick'
		};
	}

	constructor(options?) {
		super(options);
	}

	connectButtonClick(e : Event) : boolean {
		var hostname : string = this.$('#connection-host').val(),
			port : number = this.$('#connection-port').val(),
			ai = (<HTMLInputElement>this.$('#connection-ai')[0]).checked,
			name = this.$('#player-name').val();

		this.disableInputs();
		this.model.showToast('Connecting...');

		this.model.connect(name, hostname, port, ai).catch((message) => {
			var toastText = 'Failed to connect to WebSocket server.';

			if (message.command && message.command === 'reject_join_game') {
				toastText = 'Join rejected: "' + (<Messages.RejectJoinGameMessage>message).payload + '".';
			}

			this.model.showToast(toastText);
			this.enableInputs();
		});

		// TODO show loading indicator.
		return false;
	}

	hostButtonClick(e : Event) : boolean {
		var port : number = +this.$('#host-port').val(),
			name = this.$('#host-player-name').val();

		this.disableInputs();
		this.model.showToast('Starting server...');
		this.model.startServer(name, port).catch(() => {
			this.model.showToast('Failed to start server.');
			this.enableInputs();
		});

		// TODO show loading indicator.
		return false;
	}

	disableInputs() : void {
		this.$('input, button').prop('disabled', true);
	}

	enableInputs() : void {
		this.$('input, button').prop('disabled', false);
	}
}

export = ConnectionView;
