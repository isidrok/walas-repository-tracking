'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Queryable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _providersql = require('./providersql');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queryable = exports.Queryable = function () {
  function Queryable(entity, context) {
    _classCallCheck(this, Queryable);

    this._entity = entity;
    this._context = context;
    this._expression = { order: [] };
    this._provider = new _providersql.ProviderSql();
  }

  _createClass(Queryable, [{
    key: 'select',
    value: function select(projection) {
      this._expression.select = projection.expression;
      return this;
    }
  }, {
    key: 'where',
    value: function where(predicate) {
      this._expression.where = predicate.expression;
      return this;
    }
  }, {
    key: 'orderBy',
    value: function orderBy(selector) {
      this._order(selector, 'asc');
      return this;
    }
  }, {
    key: 'orderByDescending',
    value: function orderByDescending(selector) {
      this._order(selector, 'desc');
      return this;
    }
  }, {
    key: 'thenBy',
    value: function thenBy(selector) {
      this._order(selector, 'asc');
      return this;
    }
  }, {
    key: 'thenByDescending',
    value: function thenByDescending(selector) {
      this._order(selector, 'desc');
      return this;
    }
  }, {
    key: '_order',
    value: function _order(expression, type) {
      this.expression.order.push({ expression: expression, type: type });
    }
  }, {
    key: 'exec',
    value: function exec() {
      this.provider.exec(this._expression, this._entity, this._context);
    }
  }, {
    key: 'provider',
    get: function get() {
      return this._provider;
    }
  }, {
    key: 'expression',
    get: function get() {
      return this._expression;
    }
  }]);

  return Queryable;
}();