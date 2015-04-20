import View = require('./view');
import Model = require('./model');

var TIMEOUT = 5000;

class Toast extends View<Model> {
	private message : string;

	static persistentToast : Toast;

	get className() {
		return 'toast';
	}

	initialize(options? : any) {
		this.message = options.message;

		if (options.persistent) {
			// Clear any previous persistent toasts.
			if (Toast.persistentToast) {
				Toast.persistentToast.remove();
			}

			Toast.persistentToast = this;
		} else {
			setTimeout(this.remove.bind(this), TIMEOUT);
		}
	}

	render() {
		this.$el.text(this.message);
		return this;
	}
}

export = Toast;
