'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _visitors = require('./visitors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryBuilder = exports.QueryBuilder = function () {
  function QueryBuilder() {
    _classCallCheck(this, QueryBuilder);

    this._prefix = 't';
    this._counter = 0;
    this._grammar = {
      select: [],
      from: {},
      join: [],
      where: [],
      order: []
    };
    this._mapping = {};
  }

  _createClass(QueryBuilder, [{
    key: 'nextPrefix',
    value: function nextPrefix() {
      return this._prefix + this._counter++;
    }

    /**
     * Adds the tables of the entities specified as arguments
     * into the mapping object, if a table is not found in the path,
     * for example the entities are [foo,bar,baz], and bar has not
     * yet a prefix, then it creates the prefix of bar aswell.
     * Prefixes are stored inside the attribute self of the target object,
     * so the previous example would create the following mapping:
     * mapping:{
     *  foo:{
     *   self:'t1',
     *   bar:{
     *    self: 't2',
     *    baz:{self:'t3'}
     *   }
     *  }
     * }
     * @param {any} entities
     * @param {any} metaEntities
     *
     * @memberOf QueryBuilder
     */

  }, {
    key: 'addToMapping',
    value: function addToMapping(entities, metaEntities) {
      var _this = this;

      var tables = this._mapToTables(entities, metaEntities);
      tables.reduce(function (pre, cur, i) {
        pre[cur] = pre[cur] || { self: _this.nextPrefix() };
        return pre[cur];
      }, this._mapping);
    }
    /**
     * Gets the prefix associated with the last entity
     * inside a sequence of them.
     * @param {any} entities
     * @param {any} metaEntities
     * @return {string} prefix of the table of the last entity in entities.
     *
     * @memberOf QueryBuilder
     */

  }, {
    key: 'getPrefix',
    value: function getPrefix(entities, metaEntities) {
      var tables = this._mapToTables(entities, metaEntities);
      return tables.reduce(function (pre, cur) {
        return pre[cur];
      }, this._mapping).self;
    }
    /**
     * Maps an array of entities to its tables stracted
     * form the metadata of each of the entities.
     * @param {any} entities
     * @param {any} metaEntities
     * @return {string} table associated with the las entity in entities.
     *
     * @memberOf QueryBuilder
     */

  }, {
    key: '_mapToTables',
    value: function _mapToTables(entities, metaEntities) {
      return entities.map(function (entity) {
        return metaEntities.filter(function (metaEntity) {
          return metaEntity.entity.name === entity.name;
        })[0].meta.class.entity.table;
      });
    }
    /**
     * Visits all the attributes of the expression
     * in order to build the grammar object
     * @param {any} expression contains the queries
     * @param {any} entity target entity of the queries
     * @param {any} context DbContext where the entity is stored
     *
     * @memberOf QueryBuilder
     */

  }, {
    key: 'exec',
    value: function exec(expression, entity, context) {
      var _this2 = this;

      if (expression.select) {
        var select = new _visitors.VisitorSelect(expression.select, entity, context, this);
        select.exec();
      }
      if (expression.where) {
        var where = new _visitors.VisitorWhere(expression.where, entity, context, this);
        where.exec();
      }
      expression.order.map(function (order) {
        return new _visitors.VisitorOrder(order, entity, context, _this2).exec();
      });
    }
  }, {
    key: 'grammar',
    get: function get() {
      return this._grammar;
    }
  }]);

  return QueryBuilder;
}();