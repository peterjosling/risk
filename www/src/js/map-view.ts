import View = require('./view');
import Game = require('./game');

class MapView extends View<Game> {
	template = <Function>require('../hbs/map-view.hbs');

	get className() {
		return 'map';
	}

	render() {
		super.render();
		this.updateMapState();
		return this;
	}

	updateMapState() {
		this.model.map.territories.forEach(function(territory) {
			// Set fill colour to match owning player.
			var owner = territory.getOwner();
			var colour = '#FFFFFF';
			var $territory = this.$('[data-territory-id' + territory.id + ']');

			if (owner) {
				colour = owner.getColour();
			}

			$territory.attr('fill', colour);

			// Show number of armies.
			var armies = territory.getArmies();
			var armiesText = '<text x="50%" y="50%">' + armies + '</text>';

			if (armies === 0) {
				armiesText = '';
			}

			$territory.html(armiesText);
		}, this);
	}
}

export = MapView;
