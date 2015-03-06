import View = require('./view');
import Game = require('./game');

class ConnectionView extends View<Game> {
	template = <Function>require('../hbs/connection-view.hbs');

	constructor(options?) {
		super(options);

		this.events = <any>{
			'click .connect-button': 'connectButtonClick'
		};
	}

	connectButtonClick(e : Event) : void {
		var hostname : string = this.$('#connection-host').val(),
			port : number = this.$('#connection-port').val();

		this.model.connect(hostname, port).then(() => {

		}, () => {
			alert('Failed to connect');
		});

		// TODO show loading indicator.
	}
}

export = ConnectionView;
