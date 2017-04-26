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
  /**
   * Flags the property of the body with buildOrder = true
   * because this is the one that will be used for sorting
   * @param {any} node
   *
   * @memberOf VisitorOrder
   */


  _createClass(VisitorOrder, [{
    key: 'ArrowFunctionExpression',
    value: function ArrowFunctionExpression(node) {
      node.body.property.buildOrder = true;
      this.visit(node.body);
    }
    /**
     * Manages the parent assignment and marks the first
     * identifier with the main entity
     * @param {any} node
     *
     * @memberOf VisitorOrder
     */

  }, {
    key: 'MemberExpression',
    value: function MemberExpression(node) {
      if (node.object.type === 'MemberExpression') this.visit(node.object);
      if (node.object.type === 'Identifier') {
        /**
         * if the object is an identifier that means that we are
         * in the first element of the expression, for example
         * in Foo.orderBy(c=>c.bar.id) the current node contains c.bar
         * and the object is c, which represents Foo, so we add the main
         * entity to the node containing c and to the mapping
         */
        node.object.entities = [this._entity];
        this._provider.addToMapping(node.object.entities, this._metaEntities);
      }
      // node.object in case the object is an identifier
      node.property.parent = node.object.property || node.object;
      this.visit(node.property);
    }

    /**
     * Manages the entities of a given property and
     * builds the order and join statements
     * @param {any} node
     *
     * @memberOf VisitorOrder
     */

  }, {
    key: 'Identifier',
    value: function Identifier(node) {
      node.entities = node.parent.entities;
      if (node.buildOrder) this._buildOrder(node);else {
        /**
         * We take the property from the node, and the entity
         * it belongs to, then concatenate it with the parent
         * entities and add it to the mapping.
         * Since the node is not flagged for building the order
         * expression, it represents a relation between entities
         * so we build a join expression.
         */
        var property = node.name;
        var propertyEntities = node.parent.entities.concat(this.getEntity(node.parent.entities, property));
        this._provider.addToMapping(propertyEntities, this._metaEntities);
        this.buildJoin(node, propertyEntities);
        node.entities = propertyEntities;
      }
    }
    /**
     * Builds an order object an appends it into the
     * order array of the grammar, the order object
     * must have the following properties:
     *  prefix: prefix of the entity that contains the sorting property
     *  field: the property to sort by
     *  type: the sorting type, that comes from the original order object
     * @param {any} node
     *
     * @memberOf VisitorOrder
     */

  }, {
    key: '_buildOrder',
    value: function _buildOrder(node) {
      var order = {
        prefix: this._provider.getPrefix(node.entities, this._metaEntities),
        field: node.name,
        type: this._type
      };
      this._provider.grammar.order.push(order);
    }
  }]);

  return VisitorOrder;
}(_visitorbase.VisitorBase);