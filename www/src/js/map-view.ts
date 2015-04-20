import View = require('./view');
import Game = require('./game');

class MapView extends View<Game> {
	template = <Function>require('../hbs/map-view.hbs');

	get className() {
		return 'map';
	}

	get events() {
		return {
			'click .territory': 'territoryClick'
		}
	}

	initialize() {
		this.listenTo(this.model, 'change:map', this.updateMapState);
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
			var $territory = this.$('.territory[data-territory-id=' + territory.id + ']');

			if (owner) {
				colour = owner.getColour();
			}

			$territory.attr('fill', colour);

			// Show number of armies.
			var armies = territory.getArmies();
			this.$('text[data-territory-id=' + territory.id + '] tspan').text(armies);
		}, this);
	}

	territoryClick(e : MouseEvent) {
		var territoryId = this.$(e.currentTarget).data('territory-id');
		this.trigger('territorySelect', +territoryId);
	}
}

export = MapView;
