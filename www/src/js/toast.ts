import View = require('./view');
import Model = require('./model');

var TIMEOUT = 5000;

class Toast extends View<Model> {
	private message : string;

	get className() {
		return 'toast';
	}

	initialize(options? : any) {
		this.message = options.message;
		setTimeout(this.remove.bind(this), TIMEOUT);
	}

	render() {
		this.$el.text(this.message);
		return this;
	}
}

export = Toast;
