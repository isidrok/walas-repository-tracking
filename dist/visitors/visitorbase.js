'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisitorBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _babylon = require('babylon');

var _walasMetaApi = require('walas-meta-api');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VisitorBase = exports.VisitorBase = function () {
  function VisitorBase(expression, entity, context, provider) {
    _classCallCheck(this, VisitorBase);

    this._ast = (0, _babylon.parse)(expression);
    this._entity = entity;
    this._metaEntities = (0, _walasMetaApi.getMetaEntities)(context.constructor);
    this._provider = provider;
  }

  _createClass(VisitorBase, [{
    key: 'File',
    value: function File(node) {
      this.visit(node.program);
    }
  }, {
    key: 'Program',
    value: function Program(node) {
      this.visit(node.body[0]);
    }
  }, {
    key: 'ExpressionStatement',
    value: function ExpressionStatement(node) {
      this.visit(node.expression);
    }
  }, {
    key: 'CallExpression',
    value: function CallExpression(node) {
      this.visit(node.arguments[0]);
    }
  }, {
    key: 'exec',
    value: function exec() {
      this.visit(this._ast);
    }
  }, {
    key: 'visit',
    value: function visit(node) {
      var visitor = this[node.type];
      visitor.call(this, node);
    }

    /**
     * Adds a join objet to the correct join array,
     * first is gets the prefix of the entity the property belongs to,
     * then creates the join object and extracts all the joins of the grammar.
     * If there is already an array of joins with that prefix it is appended
     * to it, otherwise it is added to the joins of the grammar object.
     * @param {any} node
     *
     * @memberOf VisitorBase
     */

  }, {
    key: 'buildJoin',
    value: function buildJoin(node, nextEntities) {
      var entities = node.entities;
      var parent = entities[entities.length - 1];
      var property = node.type !== 'Identifier' ? node.key.name : node.name;
      var parentPrefix = this._provider.getPrefix(entities, this._metaEntities);
      var prefix = this._provider.getPrefix(nextEntities, this._metaEntities);
      var joinObj = this._getjoinObject(parent, property, prefix);
      var joins = this._getAllJoins(this._provider.grammar.join);
      if (joins[prefix]) return;
      // TODO if !joins[parent] createJoin with parent
      var target = joins[parentPrefix] ? joins[parentPrefix] : this._provider.grammar.join;
      target.push(joinObj);
    }
    /**
     * Builds a join object taking information form:
     *  -Property parent: contains if the property
     *  is required or not and the kind of relation.
     *  -Property entity metainformation: contains the provider
     *  and the table of the entity to which the property belongs to.
     *
     * Then it builds a join object whose attributes are:
     *  table: table of the entity the property belongs to,
     *  prefix: prefix associated to that table in the mapping,
     *  relation: type of the relation between that entity and its parent,
     *  required: if the property is required or not,
     *  on: array of attributes that are common in both entities,
     *  join: empty array to store possible future joins
     *
     * @param {any} parent
     * @param {any} property
     * @param {any} prefix
     * @return {object} join object with the properties described
     * previously.
     * @memberOf VisitorBase
     */

  }, {
    key: '_getjoinObject',
    value: function _getjoinObject(parent, property, prefix) {
      var prop = this._metaEntities.filter(function (c) {
        return c.entity.name === parent.name;
      })[0].meta.properties[property];
      var relation = prop.hasOne || prop.hasMany;
      var entity = this._metaEntities.filter(function (c) {
        return c.entity.name === relation.name;
      })[0].meta.class.entity;
      return {
        table: entity.table,
        prefix: prefix,
        relation: prop.hasOne ? 'hasOne' : 'hasMany',
        required: prop.required,
        on: ['id', 'id'],
        join: []
      };
    }

    /**
     * Searches for the entity that a given property
     * belongs to, in the metadata of the parent of the
     * entity we are currently working with.
     *
     * @param {any} entities
     * @param {any} property
     * @return {object} entity to which the property
     * belongs to.
     * @memberOf VisitorBase
     */

  }, {
    key: 'getEntity',
    value: function getEntity(entities, property) {
      var parent = entities[entities.length - 1];
      var parentMeta = this._metaEntities.filter(function (c) {
        return c.entity.name === parent.name;
      })[0].meta;
      var propMeta = parentMeta.properties[property];
      var relation = propMeta.hasOne || propMeta.hasMany;
      return relation;
    }
    /**
     * Searches recursively for all the join arrays in the grammar and stores
     * them using the prefix as a key so they can be managed easily.
     *
     * @param {any} join
     * @return {object} whose keys are the prefixes of the tables inside the
     * join array and are pointing to the specific array of that join
     *
     * @memberOf VisitorBase
     */

  }, {
    key: '_getAllJoins',
    value: function _getAllJoins(join) {
      var obj = {};
      this.__getAllJoins(join, obj);
      return obj;
    }
  }, {
    key: '__getAllJoins',
    value: function __getAllJoins(join, obj) {
      var _this = this;

      join.reduce(function (pre, cur) {
        pre[cur.prefix] = cur.join;
        _this.__getAllJoins(cur.join, obj);
        return pre;
      }, obj);
    }
  }]);

  return VisitorBase;
}();