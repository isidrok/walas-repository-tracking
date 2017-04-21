'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.VisitorWhere = undefined;

let _createClass = function () {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
    }
  } return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
  };
}();

let _visitorbase = require('./visitorbase');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
  } return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

let VisitorWhere = exports.VisitorWhere = function (_VisitorBase) {
  _inherits(VisitorWhere, _VisitorBase);

  function VisitorWhere(expression, entity, context, provider) {
    _classCallCheck(this, VisitorWhere);

    return _possibleConstructorReturn(this, (VisitorWhere.__proto__ || Object.getPrototypeOf(VisitorWhere)).call(this, expression, entity, context, provider));
  }

  _createClass(VisitorWhere, [{
    key: 'visit',
    value: function visit(node, expression, type) {
      let visitor = this[node.type];
      visitor.call(this, node, expression, type);
    }
  }, {
    key: 'ArrowFunctionExpression',
    value: function ArrowFunctionExpression(node) {
      if (node.body.type === 'LogicalExpression' && node.body.operator === '||') {
          let x = node.body.left;
          node.body.left = node.body.right;
          node.body.right = x;
       
      }
      this.visit(node.body);
    }
  }, {
    key: 'LogicalExpression',
    value: function LogicalExpression(node) {
      let lhs = node.left;
      let rhs = node.right;
      let expression = [];
      if (node.extra && node.extra.parenthesized) {
        let left = lhs;
        while (left.left) {
          left.parenthesis = left.parenthesis || [];
          left.parenthesis.push('(');
          left = left.left;
        }
        let right = rhs;
        while (right.right) {
          right.parenthesis = right.parenthesis || [];
          right.parenthesis.push(')');
          right = right.right;
        }
      }

      this.visit(lhs, expression, 'left');
      this.visit(rhs, expression, 'right');

      expression.length === 2 ? expression.splice(1, 0, node.operator) : expression.unshift(node.operator);
      this._provider.grammar.where = this._provider.grammar.where.concat(expression);
    }
  }, {
    key: 'BinaryExpression',
    value: function BinaryExpression(node, expression, position) {
      let attr = node.left.type === 'Identifier' ? node.right : node.left;
      let param = node.left.type === 'Identifier' ? node.left : node.right;
      let obj = {};
      let createJoin = true;

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
      obj.parenthesis = node.parenthesis;

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
