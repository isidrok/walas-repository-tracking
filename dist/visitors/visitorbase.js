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
    // this._provider.resetPrefix();
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
      var prefix = this._provider.getPrefix(node.path);
      var imInside = joins[prefix];

      if (imInside) return;

      var name = node.type !== 'Identifier' ? node.key.name : node.name;

      var path = node.path.split('.');
      var parentPath = path.slice(0, path.length - 1).join('.');
      var myParentIsInside = parentPath ? joins[this._provider.getPrefix(parentPath)] : undefined;

      var entityMeta = myParentIsInside ? this._getMeta(this._getParentName(node)) : this._getMeta(this._entity.name);
      var meta = this._getMeta(name);
      var property = this._getProperty(entityMeta, name);

      var obj = {
        prefix: prefix,
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
  }, {
    key: '_getParentName',
    value: function _getParentName(node) {
      var name = void 0;
      if (node.type !== 'Identifier') name = node.parent.key ? node.parent.key.name : node.parent.parent.key.name;else name = node.parent.name;
      return name;
    }
    // coger propiedades del meta de entidad principal, de ahí sacar la relación y con ella sacar la clase a la que apunta y sacar su meta

  }, {
    key: '_getMeta',
    value: function _getMeta(property) {
      var _this = this;

      var meta = this._metaEntities.filter(function (c) {
        return c.entity.name === _this._entity.name;
      })[0].meta;
      var relationEntity = meta.properties[property].hasOne || meta.properties[property].hasMany;
      return this._metaEntities.filter(function (c) {
        return c.entity.name === relationEntity.name;
      })[0].meta;
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
      var _this2 = this;

      join.reduce(function (pre, cur) {
        pre[cur.prefix] = cur.join;
        _this2._getAllJoins(cur.join, obj);
        return pre;
      }, obj);
    }
  }]);

  return VisitorBase;
}();