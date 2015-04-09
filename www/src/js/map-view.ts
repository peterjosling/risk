import View = require('./view');
import Game = require('./game');

class MapView extends View<Game> {
	template = <Function>require('../hbs/map-view.hbs');

	render() {
		super.render();
		this.updateMapState();
		return this;
	}

	updateMapState() {
		this.model.map.territories.forEach(function(territory) {
			var owner = territory.getOwner();
			var colour = '#FFFFFF';

			if (owner) {
				colour = owner.getColour();
			}

			this.$('[data-territory-id' + territory.id + ']').attr('fill', colour);
		}, this);
	}
}

export = MapView;
