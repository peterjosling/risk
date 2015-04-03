/// <reference path="../../lib/backbone/backbone.d.ts" />
import Backbone = require('backbone');

interface Template {
	(data? : any) : string
}

interface ChildView {
	view: View<Backbone.Model>
	el: string
}

class View<TModel extends Backbone.Model> extends Backbone.View<TModel> {
	template : Function = (data?) => {};

	childViews : Array<ChildView> = [];

	constructor(options?) {
		super(options);
	}

	render(data? : any) : View<TModel> {
		// Render this view's template.
		this.$el.html(this.template(data));

		// Render out all child views.
		this.childViews.forEach(function(view) {
			this.$(view.el).html(view.view.render().el);
		}, this);

		return this;
	}

	destroy() : void {
		this.childViews.forEach(view => {
			view.view.destroy();
		});
	}

	static Template;
}

export = View;
