'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisitorSelect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _visitorbase = require('./visitorbase');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisitorSelect = exports.VisitorSelect = function (_VisitorBase) {
  _inherits(VisitorSelect, _VisitorBase);

  function VisitorSelect(expression, entity, context, provider) {
    _classCallCheck(this, VisitorSelect);

    return _possibleConstructorReturn(this, (VisitorSelect.__proto__ || Object.getPrototypeOf(VisitorSelect)).call(this, expression, entity, context, provider));
  }

  _createClass(VisitorSelect, [{
    key: 'ArrowFunctionExpression',
    value: function ArrowFunctionExpression(node) {
      var _this2 = this;

      /* The entire body of the arrow function is flagged with a
      prefix which will be shared by all the attributes that directly
      belong to the main entity, so this is the moment to build the
      from statement, in addition, this ensures that the from is not build
      more than once since only one arrow function expression will be processed.*/
      var meta = this._metaEntities.filter(function (c) {
        return c.entity.name === _this2._entity.name;
      })[0].meta;
      var table = meta.class.entity.table;
      this._provider.addToMapping(table);
      this._buildFrom(meta);
      node.body.path = table;
      this.visit(node.body);
    }
  }, {
    key: 'ObjectExpression',
    value: function ObjectExpression(node) {
      var _this3 = this;

      node.properties.forEach(function (c) {
        c.path = node.path;
        c.parent = node;
        _this3.visit(c);
      });
    }
  }, {
    key: 'ArrayExpression',
    value: function ArrayExpression(node) {
      var _this4 = this;

      node.elements.forEach(function (c) {
        c.path = node.path;
        c.parent = node;
        _this4.visit(c);
      });
    }
  }, {
    key: 'ObjectProperty',
    value: function ObjectProperty(node) {
      if (node.value.type === 'Identifier') node.value.path = node.path;else {
        var property = node.key.name;
        var table = this._getMeta(property).class.entity.table;
        this._provider.addToMapping(table, node.path);
        node.path = node.path ? node.path + '.' + table : table;
        node.value.path = node.path;
        node.value.parent = node;
        this._buildJoin(node);
      }
      this.visit(node.value);
    }
  }, {
    key: 'Identifier',
    value: function Identifier(node) {
      this._provider.grammar.select.push({
        prefix: this._provider.getPrefix(node.path),
        field: node.name
      });
    }
  }, {
    key: '_buildFrom',
    value: function _buildFrom(meta) {
      var table = meta.class.entity.table;
      var provider = meta.class.entity.provider;
      this._provider.grammar.from = {
        from: table,
        prefix: this._provider.getPrefix(table),
        provider: provider
      };
    }
  }]);

  return VisitorSelect;
}(_visitorbase.VisitorBase);