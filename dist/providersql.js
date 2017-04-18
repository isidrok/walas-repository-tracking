'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProviderSql = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _visitors = require('./visitors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProviderSql = exports.ProviderSql = function () {
  function ProviderSql() {
    _classCallCheck(this, ProviderSql);

    this._prefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    this._counter = 0;
    this._grammar = {
      select: [],
      from: {},
      join: [],
      where: [],
      order: []
    };
  }

  _createClass(ProviderSql, [{
    key: 'resetPrefix',
    value: function resetPrefix() {
      this._counter = 0;
    }
  }, {
    key: 'nextPrefix',
    value: function nextPrefix() {
      return this._prefixes[this._counter++];
    }
  }, {
    key: 'exec',
    value: function exec(expression, entity, context) {
      var _this = this;

      if (expression.select) {
        var select = new _visitors.VisitorSelect(expression.select, entity, context, this);
        select.exec();
      }
      // let where = new VisitorWhere(expression.where, entity, context, this);
      // where.exec();
      expression.order.map(function (order) {
        return new _visitors.VisitorOrder(order, entity, context, _this).exec();
      });
    }
  }, {
    key: 'grammar',
    get: function get() {
      return this._grammar;
    }
  }]);

  return ProviderSql;
}();