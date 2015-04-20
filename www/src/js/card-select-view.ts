import View = require('./view');
import Model = require('./model');
import Game = require('')
import CardList = require('./card-list');

class CardSelectView extends View<Game> {
	template = <Function>require('../hbs/card-select-view.hbs');

	get className() : string {
		return 'card-select hidden';
	}

	get events() : any {
		return {
			'click .card': 'cardClick',
			'click .trade-button': 'tradeButtonClick',
			'click .done-button': 'doneButtonClick'
		}
	}

	getRenderData() : any {
		// The player *must* trade in cards if they have 5 or 6.
		var mustTrade = this.collection.length > 4;

		return {
			mustTrade: mustTrade,
			cards: this.collection.toJSON()
		}
	}

	show() {
		this.render();
		this.$el.removeClass('hidden');
	}

	hide() {
		this.$el.addClass('hidden');
	}

	cardClick(e : MouseEvent) {
		var currentlySelected = this.$('.card.active').length;
		var $target = $(e.currentTarget);

		// Don't allow more than three cards to be selected at once.
		if (currentlySelected === 3 && !$target.hasClass('active')) {
			return;
		}

		$target.toggleClass('active');
	}

	tradeButtonClick() : boolean {
		var cards = this.$('.card.active').map(function() {
			return $(this).data('id');
		}).get().map(id => this.collection.get(id));

		if (cards.length !== 3) {
			return;
		}

		// Check cards make a valid set.
		var counts = {
			wildcard: 0,
			cavalry: 0,
			infantry: 0,
			artillery: 0
		};

		cards.forEach(card => cards[card.getType()]++);

		var valid = counts.wildcard > 0 || counts.cavalry === 3 || counts.infantry === 3 || counts.artillery === 3 || counts.cavalry + counts.infantry + counts.artillery === 3;

		if (!valid) {
			alert('Invalid card combination');
			return;
		}

		// Trade valid.
		this.trigger('trade', cards);
		return false;
	}

	doneButtonClick() {
		this.trigger('close');
		this.hide();
	}
}

export = CardSelectView;
