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
	template : Function = (context?, data?) => {};

	childViews : Array<ChildView> = [];
	listViews : Array<View<Backbone.Model>> = [];

	constructor(options?) {
		super(options);
	}

	render(data? : any) : View<TModel> {
		// Render this view's template.
		this.$el.html(this.template(this.getRenderData(), {data: data}));

		// Render out all child views.
		this.childViews.forEach(function(view) {
			this.$(view.el).html(view.view.render().el);
		}, this);

		return this;
	}

	getRenderData() : {} {
		var model = this.model || this.collection;

		if (model) {
			return model.toJSON();
		}

		return {};
	}

	destroy() : void {
		this.childViews.forEach(view => view.view.destroy());
		this.listViews.forEach(view => view.destroy());
	}

	static Template;
}

export = View;
