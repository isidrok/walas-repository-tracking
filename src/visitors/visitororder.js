import { VisitorBase } from './visitorbase';
import { check } from './check';
export class VisitorOrder extends VisitorBase {
  constructor(order, entity, context, provider) {
    super(order.expression, entity, context, provider);
    this._type = order.type;
  }
  /**
   * Flags the property of the body with buildOrder = true
   * because this is the one that will be used for sorting
   * @param {any} node
   *
   * @memberOf VisitorOrder
   */
  ArrowFunctionExpression(node) {
    check.hasOnlyOneParam(node);
    check.isValidOrderBody(node);
    this._arrowFuncId = node.params[0].name;
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
  MemberExpression(node) {
    check.isValidMemberExpression(node, this._arrowFuncId);
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
  Identifier(node) {
    node.entities = node.parent.entities;
    check.isInParentMeta(node, this._metaEntities);
    if (node.buildOrder) this._buildOrder(node);
    else {
      /**
       * We take the property from the node, and the entity
       * it belongs to, then concatenate it with the parent
       * entities and add it to the mapping.
       * Since the node is not flagged for building the order
       * expression, it represents a relation between entities
       * so we build a join expression.
       */
      let property = node.name;
      let propertyEntities = node.parent.entities
        .concat(this._getEntity(node.parent.entities, property));
      this._provider.addToMapping(propertyEntities, this._metaEntities);
      this._buildJoin(node, propertyEntities);
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
  _buildOrder(node) {
    let order = {
      prefix: this._provider.getPrefix(node.entities, this._metaEntities),
      field: node.name,
      type: this._type,
    };
    this._provider.grammar.order.push(order);
  }
}

