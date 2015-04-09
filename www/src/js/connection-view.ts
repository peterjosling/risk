import View = require('./view');
import Game = require('./game');

class ConnectionView extends View<Game> {
	template = <Function>require('../hbs/connection-view.hbs');

	constructor(options?) {
		super(options);

		this.events = <any>{
			'click .connect-button': 'connectButtonClick'
		};

		this.delegateEvents();
	}

	connectButtonClick(e : Event) : boolean {
		var hostname : string = this.$('#connection-host').val(),
			port : number = this.$('#connection-port').val();

		this.model.showToast('Connecting...')

		this.model.connect(hostname, port).catch(() => {
			this.model.showToast('Failed to connect to server.');
			// TODO give reason.
		});

		// TODO show loading indicator.
		return false;
	}
}

export = ConnectionView;
