import View = require('./view');
import Game = require('./game');

class ConnectionView extends View<Game> {
	template = <Function>require('../hbs/connection-view.hbs');

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
			port : number = this.$('#connection-port').val();

		this.disableInputs();
		this.model.showToast('Connecting...');

		this.model.connect(hostname, port).catch(() => {
			this.model.showToast('Failed to connect to server.');
			// TODO give reason.
			this.enableInputs();
		});

		// TODO show loading indicator.
		return false;
	}

	hostButtonClick(e : Event) : boolean {
		var port : number = +this.$('#host-port').val();

		this.disableInputs();
		this.model.showToast('Starting server...');
		this.model.startServer(port).catch(() => {
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
