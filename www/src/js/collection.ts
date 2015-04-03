/// <reference path="../../lib/backbone/backbone.d.ts" />
import Backbone = require('backbone');
import Model = require('./model');

class Collection<TModel extends Model> extends Backbone.Collection<TModel> {}

export = Collection;
