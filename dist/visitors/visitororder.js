'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisitorOrder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _visitorbase = require('./visitorbase');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisitorOrder = exports.VisitorOrder = function (_VisitorBase) {
  _inherits(VisitorOrder, _VisitorBase);

  function VisitorOrder(order, entity, context, provider) {
    _classCallCheck(this, VisitorOrder);

    var _this = _possibleConstructorReturn(this, (VisitorOrder.__proto__ || Object.getPrototypeOf(VisitorOrder)).call(this, order.expression, entity, context, provider));

    _this._type = order.type;
    return _this;
  }

  _createClass(VisitorOrder, [{
    key: 'ArrowFunctionExpression',
    value: function ArrowFunctionExpression(node) {
      node.body.prefix = this._provider.nextPrefix();
      node.body.property.build = true;
      if (node.body.object.type === 'Identifier') node.body.property.parent = node.body;
      this.visit(node.body);
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
      if (node.build) this._buildOrder(node);else this._buildJoin(node);
    }
  }, {
    key: '_buildOrder',
    value: function _buildOrder(node) {
      var order = {
        prefix: node.parent.prefix,
        field: node.name,
        type: this._type
      };
      this._provider.grammar.order.push(order);
    }
  }]);

  return VisitorOrder;
}(_visitorbase.VisitorBase);