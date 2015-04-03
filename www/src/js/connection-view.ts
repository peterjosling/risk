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

		this.model.connect(hostname, port).then(() => {
			this.trigger('gameConnected')
		}, () => {
			alert('Failed to connect');
		});

		// TODO show loading indicator.
		return false;
	}
}

export = ConnectionView;
