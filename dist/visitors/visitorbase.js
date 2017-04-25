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
  }, {
    key: '_buildJoin',
    value: function _buildJoin(node) {
      // search if there is a join with the same prefix already built
      // and in that case  return
      var joins = this._getAllJoins(this._provider.grammar.join);
      var prefix = this._provider.getPrefix(node.path);
      var joinBuilt = joins[prefix];
      if (joinBuilt) return;

      // if there is not a join with that prefix we get the parent of the property
      // to know if the new join must be creaded inside the join array of the grammar
      // or in case the node has a parent, inside its parent join array.
      var path = node.path.split('.');
      var pathToParent = path.slice(0, path.length - 1).join('.');
      var parentJoin = pathToParent ? joins[this._provider.getPrefix(pathToParent)] : undefined;

      // TODO: if !parentJoin build parent join before continuing with the child join

      // here we get the name of the property that creates the relation,
      // and then find in which metadata is the information about the property stored,
      // it can be in the main entity metadata or in its parent metadata (if it has parent).
      // Once we know this we extract the information about the property (required, relationType
      // and its class name).
      // From the class name we finally get the table name and the provider.
      var propertyName = node.type !== 'Identifier' ? node.key.name : node.name;
      var targetMeta = parentJoin ? this._getMeta(_getEntityFromProperty(propertyName, node.path)) : this._getMeta(this._entity.name);
      var meta = this._getMeta(propertyName);
      var property = this._getProperty(entityMeta, propertyName);

      // finally we build the join object and insert it in the destination,
      // the join of the parent or the join of the grammar
      var obj = {
        prefix: prefix,
        table: meta.class.entity.table,
        required: property.required,
        relation: property.hasOne ? 'hasOne' : 'hasMany',
        provider: property.provider || meta.class.entity.provider,
        on: ['id', 'id'], // some kind of convention??
        join: []
      };
      var destination = parentJoin || this._provider.grammar.join;
      destination.push(obj);
    }
  }, {
    key: '_getParentProperty',
    value: function _getParentProperty(node) {
      var property = void 0;
      if (node.type !== 'Identifier') property = node.parent.key ? node.parent.key.name : node.parent.parent.key.name;
      // else property = node.parent.name;
      return property || node.parent.name;
    }
  }, {
    key: '_getMeta',
    value: function _getMeta(entity) {
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
    value: function _getAllJoins(join) {
      var obj = {};
      this.__getAllJoins(join, obj);
      return obj;
    }
  }, {
    key: '__getAllJoins',
    value: function __getAllJoins(join, obj) {
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
// _getMeta(property) {
//     let meta = this._metaEntities.filter(c => {
//       return c.entity.name === this._entity.name;
//     })[0].meta;
//     let relationEntity = meta.properties[property].hasOne || meta.properties[property].hasMany;
//     return this._metaEntities.filter(c => {
//       return c.entity.name === relationEntity.name;
//     })[0].meta;
//   }