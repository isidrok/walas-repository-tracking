'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisitorSelect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _visitorbase = require('./visitorbase');

var _check = require('./check');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisitorSelect = exports.VisitorSelect = function (_VisitorBase) {
  _inherits(VisitorSelect, _VisitorBase);

  function VisitorSelect(expression, entity, context, queryBuilder) {
    _classCallCheck(this, VisitorSelect);

    return _possibleConstructorReturn(this, (VisitorSelect.__proto__ || Object.getPrototypeOf(VisitorSelect)).call(this, expression, entity, context, queryBuilder));
  }

  /**
   * Adds the prefix of the main entity to the mapping
   * then builds the from statement of the grammar and
   * propagates the entity to the body of the arrow function
   * @param {any} node
   *
   * @memberOf VisitorSelect
   */


  _createClass(VisitorSelect, [{
    key: 'ArrowFunctionExpression',
    value: function ArrowFunctionExpression(node) {
      var _this2 = this;

      _check.check.hasOnlyOneParam(node);
      _check.check.isValidSelectBody(node);
      /**
       * Extract the metadata and the entity of the one
       * that was used to call the select, for example
       * in context.foo.select we get foo
       */
      var metaEntity = this._metaEntities.filter(function (c) {
        return c.entity.name === _this2._entity.name;
      })[0];
      var entity = metaEntity.entity;
      var meta = metaEntity.meta;

      /**
       * Flag the the arrow function with the main entity
       * and propagate it to its body.
       * This will be important in order to build the joins and
       * manage the prefix of the mapping.
       */
      node.entities = [entity];
      node.body.entities = node.entities;

      /**
       * Adds the entity to the provider mapping and
       * we are working with the main entity this is the
       * place to build the from object of the grammar.
       * Additionally, as there should not be more arrow functions
       * inside the query this will only happen once.
       */
      this._queryBuilder.addToMapping(node.entities, this._metaEntities);
      this._buildFrom(node.entities, meta);
      this.visit(node.body);
    }

    /**
     * Inserts its entities array into its children
     * and visits each one of them.
     * @param {any} node
     *
     * @memberOf VisitorSelect
     */

  }, {
    key: 'ObjectExpression',
    value: function ObjectExpression(node) {
      var _this3 = this;

      node.properties.forEach(function (c) {
        c.entities = node.entities;
        _this3.visit(c);
      });
    }

    /**
    * Inserts its entities array into its children
    * and visits each one of them.
    * @param {any} node
    *
    * @memberOf VisitorSelect
    */

  }, {
    key: 'ArrayExpression',
    value: function ArrayExpression(node) {
      var _this4 = this;

      node.elements.forEach(function (c) {
        c.entities = node.entities;
        _this4.visit(c);
      });
    }

    /**
     * Identifies new entities on the query and adds them
     * to the mapping. Then it builds the new join statements.
     * @param {any} node
     *
     * @memberOf VisitorSelect
     */

  }, {
    key: 'ObjectProperty',
    value: function ObjectProperty(node) {
      _check.check.isValidObjectProperty(node);
      /**
       * When the type of node.value is an identifier
       * it is because the object property belongs to
       * one entity and does not contain nested ones.
       *
       * For example, in {foo:{bar:{id,description}}
       * the type of node.value in foo and bar is an
       * object expression, while in id and description
       * is an identifier.
       */
      if (node.value.type === 'Identifier') {
        /**
         * If it is an identifier we just need to mark
         * its value with the entities so we can assign
         * a prefix to it later on.
         */
        node.value.entities = node.entities;
      } else {
        /**
         * When it is and object expression we take the
         * name of the property it represents inside an entity.
         * Whit that property we can look in the parent entity
         * for the it and get the entity which conforms the relation
         * between the parent entity and this property.
         * Then we push that entity into the entities of the node,
         * add it to the mapping and pass it to its child.
         *
         * As are in a possibly new visites entity a join statement
         * has to be built aswell.
         */
        var property = node.key.name;
        var propertyEntities = node.entities.concat(this._getEntity(node.entities, property));
        this._queryBuilder.addToMapping(propertyEntities, this._metaEntities);
        node.value.entities = propertyEntities;
        this._buildJoin(node, propertyEntities);
      }
      this.visit(node.value);
    }

    /**
     * Adds all the identifiers of the select expression
     * to the select property of the grammar.
     * Select objects have the following attributes:
     *  prefix: prefix of the table to which the property (identifier) belongs to,
     *  field: name of the property (identifier)
     * @param {any} node
     *
     * @memberOf VisitorSelect
     */

  }, {
    key: 'Identifier',
    value: function Identifier(node) {
      _check.check.isInParentMeta(node, this._metaEntities);
      this._queryBuilder.grammar.select.push({
        prefix: this._queryBuilder.getPrefix(node.entities, this._metaEntities),
        field: node.name
      });
    }

    /**
     * Builds the from statement of the grammar
     * using the entity and the metadata passed by
     * the arrow function from the main entity.
     * The from stament must have the following attributes:
     *  from: table the main entity belongs to,
     *  prefix: prefix associated to that table,
     *  provider: provider in which the table is stored
     * @param {any} entities
     * @param {any} meta
     *
     * @memberOf VisitorSelect
     */

  }, {
    key: '_buildFrom',
    value: function _buildFrom(entities, meta) {
      this._queryBuilder.grammar.from = {
        from: meta.class.entity.table,
        prefix: this._queryBuilder.getPrefix(entities, this._metaEntities),
        provider: meta.class.entity.provider
      };
    }
  }]);

  return VisitorSelect;
}(_visitorbase.VisitorBase);