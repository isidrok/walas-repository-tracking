'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisitorBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _babylon = require('babylon');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VisitorBase = exports.VisitorBase = function () {
  function VisitorBase(expression, entity, context, provider) {
    _classCallCheck(this, VisitorBase);

    this._ast = (0, _babylon.parse)(expression);
    this._entity = entity;
    this._context = context;
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
      // {type:'left',table:'bar',prefix:'b', provider:'google',on:["id","id"],join:[]
      var joins = {};
      this._getAllJoins(this._provider.grammar.join, joins);
      var imInside = joins[node.prefix];
      if (!imInside) {
        var obj = {
          prefix: node.prefix,
          table: node.key.name, // look in the metaentities for the name and extract table name from meta
          required: true, // look in the meta of entity, then search for the property pointed by table and see if its required
          relation: 'hasOne', // look in the meta of entity, then search for the property pointed by table and see the type or relation
          provider: 'google', // look again for the meta of the property that creates the relaation with table and extract the provider
          on: ['id', 'id'], // some kind of convention??
          join: []
        };
        var myParentIsInside = joins[node.parent.prefix];
        var destination = myParentIsInside || this._provider.grammar.join;
        destination.push(obj);
      }
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