'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisitorWhere = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

  _createClass(VisitorWhere, [{
    key: 'visit',
    value: function visit(node, expression, type) {
      var visitor = this[node.type];
      visitor.call(this, node, expression, type);
    }
  }, {
    key: 'ArrowFunctionExpression',
    value: function ArrowFunctionExpression(node) {
      this.visit(node.body);
    }
  }, {
    key: 'LogicalExpression',
    value: function LogicalExpression(node) {
      var lhs = node.left;
      var rhs = node.right;
      var expression = [];
      this.visit(lhs, expression, 'left');
      this.visit(rhs, expression, 'right');
      expression.splice(1, 0, node.operator);
      this._provider.grammar.where = expression.concat(this._provider.grammar.where);
    }
  }, {
    key: 'BinaryExpression',
    value: function BinaryExpression(node, expression, position) {
      var attr = node.left.type === 'Identifier' ? node.right : node.left;
      var param = node.left.type === 'Identifier' ? node.left : node.right;
      var obj = {};
      var createJoin = true;

      this._provider.resetPrefix();
      node.prefix = this._provider.nextPrefix();

      if (attr.object.type === 'Identifier') {
        attr.object.prefix = node.prefix;
        attr.property.parent = attr.object;
        createJoin = false;
      }

      this.visit(attr);
      obj.prefix = attr.property.parent.prefix;
      obj.field = attr.property.name;
      obj.operator = node.operator;
      obj.param = '@' + param.name;

      if (createJoin) this._buildJoin(attr.property.parent);
      position === 'left' ? expression.unshift(obj) : expression.push(obj);
    }
  }, {
    key: 'MemberExpression',
    value: function MemberExpression(node) {
      if (node.object.type === 'MemberExpression') {
        node.property.parent = node.object.property;
        this.visit(node.object);
      }
      this.visit(node.property);
    }
  }, {
    key: 'Identifier',
    value: function Identifier(node) {
      node.prefix = this._provider.nextPrefix();
    }
  }]);

  return VisitorWhere;
}(_visitorbase.VisitorBase);