import View = require('./view');
import Model = require('./model');

class ArmyCountSelectView extends View<Model> {
	template = <Function>require('../hbs/army-count-select-view.hbs');

	min : number;
	max : number;

	get className() : string {
		return 'army-count-select hidden';
	}

	get events() : any {
		return {
			'click .select-button': 'selectButtonClick',
			'click .cancel-button': 'cancelButtonClick'
		}
	}

	getRenderData() : any {
		return {
			min: this.min,
			max: this.max
		}
	}

	selectButtonClick(e : Event) : boolean {
		if (!(<HTMLFormElement>this.$('form')[0]).checkValidity()) {
			return true;
		}

		var value = +this.$('.army-count').val();

		this.trigger('select', value);
		this.hide();
		return false;
	}

	cancelButtonClick(e : Event) : void {
		this.hide();
	}

	show(force? : boolean) {
		this.render();
		this.$el.removeClass('hidden');
		this.$('.army-count').focus();

		if (force) {
			this.$('.cancel-button').remove();
		}
	}

	hide() {
		this.$el.addClass('hidden');
	}

	setMin(min : number) {
		this.min = min;
	}

	setMax(max : number) {
		this.max = max;
	}
}

export = ArmyCountSelectView;
