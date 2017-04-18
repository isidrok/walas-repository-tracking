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
      /* The entire body of the arrow function will be flagged with a
      prefix which will be shared by all the attributes that directly
      belong to the main entity, so this is the moment to build the
      from statement, in addition, this ensures that the from is not build
      more than once since only one arrow function expression will be processed.*/
      var firstPrefix = this._provider.nextPrefix();
      node.body.prefix = firstPrefix;
      this._buildFrom(firstPrefix);
      this.visit(node.body);
    }
  }, {
    key: 'ObjectExpression',
    value: function ObjectExpression(node) {
      var _this2 = this;

      node.properties.forEach(function (c) {
        c.parent = node;
        c.prefix = node.prefix;
        _this2.visit(c);
      });
    }
  }, {
    key: 'ArrayExpression',
    value: function ArrayExpression(node) {
      var _this3 = this;

      node.elements.forEach(function (c) {
        c.parent = node;
        c.prefix = node.prefix;
        _this3.visit(c);
      });
    }
  }, {
    key: 'ObjectProperty',
    value: function ObjectProperty(node) {
      node.value.prefix = node.prefix;
      // let meta = getmeta() this.check(meta)
      if (node.value.type !== 'Identifier') {
        /* Here we have an object property which is a container for other object
        properties, so we know that it doesn't belong to the main entity.
        We must assign this attribute a new prefix and build a join statement. */
        node.prefix = this._provider.nextPrefix();
        this._buildJoin(node);
        node.value.parent = node;
        node.value.prefix = node.prefix;
      }
      this.visit(node.value);
    }
  }, {
    key: 'Identifier',
    value: function Identifier(node) {
      this._provider.grammar.select.push({
        prefix: node.prefix,
        field: node.name
      });
    }
  }, {
    key: '_buildFrom',
    value: function _buildFrom(firstPrefix) {
      var meta = this._getMeta(this._entity.name);
      var table = meta.class.entity.table;
      var provider = meta.class.entity.provider;
      this._provider.grammar.from = {
        from: table,
        prefix: firstPrefix,
        provider: provider
      };
    }
  }]);

  return VisitorSelect;
}(_visitorbase.VisitorBase);