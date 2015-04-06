import View = require('./view');

export class PlayerListItemView extends View {
	template = <Function>require('../hbs/player-list-item-view.hbs');

	constructor(options?) {
		super(options);
		this.listenTo(this.model, 'change', this.render);
	}
}
