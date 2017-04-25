'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisitorWhere = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _visitorbase = require('./visitorbase');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisitorWhere = exports.VisitorWhere = function (_VisitorBase) {
  _inherits(VisitorWhere, _VisitorBase);

  function VisitorWhere(expression, entity, context, provider) {
    _classCallCheck(this, VisitorWhere);

    return _possibleConstructorReturn(this, (VisitorWhere.__proto__ || Object.getPrototypeOf(VisitorWhere)).call(this, expression, entity, context, provider));
  }

  /**
   * Overwrites visitorBase visit method
   * in order to propagate the expression
   * @param {any} node
   * @param {any} expression
   *
   * @memberOf VisitorWhere
   */


  _createClass(VisitorWhere, [{
    key: 'visit',
    value: function visit(node, expression) {
      var visitor = this[node.type];
      visitor.call(this, node, expression);
    }
  }, {
    key: 'ArrowFunctionExpression',
    value: function ArrowFunctionExpression(node) {
      var expression = this._provider.grammar.where;
      if (expression[0]) throw new Error('There can be only one where statement');
      this.visit(node.body, expression);
    }
    /**
     * If the logical expression has parenthesis buidls
     * a new array that will store its contents otherwise
     * the nodes of the logical expression will be inserted
     * directly into the where expression of the grammar.
     * In order to store the elements correctly the order is:
     * 1- insert the right hand side of the node.
     * 2- insert the node operator.
     * 3- insert the left hand side of the node.
     * These elements must be inserted at the beggining of the expression.
     * @param {any} node
     * @param {any} expression
     *
     * @memberOf VisitorWhere
     */

  }, {
    key: 'LogicalExpression',
    value: function LogicalExpression(node, expression) {
      var lhs = node.left;
      var rhs = node.right;

      var parenthesis = node.extra && node.extra.parenthesized;
      var nodeExpression = parenthesis ? [] : expression;

      this.visit(rhs, nodeExpression);
      nodeExpression.unshift(node.operator);
      this.visit(lhs, nodeExpression);

      if (parenthesis) expression.unshift(nodeExpression);
    }

    /**
     * First makes a distinction between the parameter
     * and the attribute inside the binaryExpression,
     * thit is, if there is an expression of the form
     * 'foo.id === 10' the attribute is foo.id and the
     * parameter 10.
     * Then visits the attribute in order to assign it a prefix.
     * Finally builds an object with the following attributes:
     *  prefix: prefix associated to the attribute,
     *  field: the name of the attribute,
     *  operator: the operator of the binaryExpression,
     *  param: the parameter concatenated with an '@',
     *  parenthesis: true if the expression is flagged as parenthesized
     * and prepends the object to the expression.
     * @param {any} node
     * @param {any} expression
     *
     * @memberOf VisitorWhere
     */

  }, {
    key: 'BinaryExpression',
    value: function BinaryExpression(node, expression) {
      var parenthesis = node.extra && node.extra.parenthesized;
      var attr = node.left.type === 'Identifier' ? node.right : node.left;
      var param = node.left.type === 'Identifier' ? node.left : node.right;
      var obj = {};

      node.prefix = this._provider.nextPrefix();
      if (attr.object.type === 'Identifier') {
        attr.object.prefix = node.prefix;
        attr.property.parent = attr.object;
      }

      _get(VisitorWhere.prototype.__proto__ || Object.getPrototypeOf(VisitorWhere.prototype), 'visit', this).call(this, attr);

      obj.prefix = attr.property.parent.prefix;
      obj.field = attr.property.name;
      obj.operator = node.operator;
      obj.param = '@' + param.name;
      obj.parenthesis = parenthesis;

      expression.unshift(obj);
    }
  }, {
    key: 'MemberExpression',
    value: function MemberExpression(node) {
      if (node.object.type === 'MemberExpression') {
        node.property.parent = node.object.property;
        _get(VisitorWhere.prototype.__proto__ || Object.getPrototypeOf(VisitorWhere.prototype), 'visit', this).call(this, node.object);
      }
      _get(VisitorWhere.prototype.__proto__ || Object.getPrototypeOf(VisitorWhere.prototype), 'visit', this).call(this, node.property);
    }
  }, {
    key: 'Identifier',
    value: function Identifier(node) {
      node.prefix = this._provider.nextPrefix();
    }
  }]);

  return VisitorWhere;
}(_visitorbase.VisitorBase);