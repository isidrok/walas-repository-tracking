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
    this._provider.resetPrefix();
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
  }, {
    key: '_buildJoin',
    value: function _buildJoin(node) {
      // {type:'left',table:'bar',prefix:'b', provider:'google',on:["id","id"],join:[]
      var joins = {};
      this._getAllJoins(this._provider.grammar.join, joins);
      var imInside = joins[node.prefix];
      if (!imInside) {
        var name = node.type !== 'Identifier' ? node.key.name : node.name;
        var myParentIsInside = node.parent ? joins[node.parent.prefix] : undefined;
        var entityMeta = myParentIsInside ? this._getMeta(this._getParentName(node)) : this._getMeta(this._entity.name);
        var meta = this._getMeta(name);
        var property = this._getProperty(entityMeta, name);
        var obj = {
          prefix: node.prefix,
          table: meta.class.entity.table,
          required: property.required,
          relation: property.hasOne ? 'hasOne' : 'hasMany',
          provider: property.provider || meta.class.entity.provider,
          on: ['id', 'id'], // some kind of convention??
          join: []
        };

        var destination = myParentIsInside || this._provider.grammar.join;
        destination.push(obj);
      }
    }
  }, {
    key: '_getParentName',
    value: function _getParentName(node) {
      var name = void 0;
      if (node.type !== 'Identifier') name = node.parent.key ? node.parent.key.name : node.parent.parent.key.name;else name = node.parent.name;
      return name;
    }
  }, {
    key: '_getMeta',
    value: function _getMeta(entityName) {
      var entity = this._metaEntities.filter(function (c) {
        return c.entity.name === entityName;
      })[0];
      return entity.meta;
    }
  }, {
    key: '_getProperty',
    value: function _getProperty(meta, entityName) {
      var props = meta.properties;
      var property = Object.keys(props).filter(function (key) {
        var relation = props[key].hasMany || props[key].hasOne;
        return relation.name === entityName;
      })[0];
      return props[property];
    }
    /**
     * Searches recursively for all the join arrays in the grammar and stores
     * them using the prefix as a key so they can be managed easily.
     * @param {Array} join
     * @param {Object} obj
     */

  }, {
    key: '_getAllJoins',
    value: function _getAllJoins(join, obj) {
      var _this = this;

      join.reduce(function (pre, cur) {
        pre[cur.prefix] = cur.join;
        _this._getAllJoins(cur.join, obj);
        return pre;
      }, obj);
    }
  }]);

  return VisitorBase;
}();