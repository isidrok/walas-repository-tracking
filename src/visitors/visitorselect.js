import { VisitorBase } from './visitorbase';
import { check } from './check';
export class VisitorSelect extends VisitorBase {
  constructor(expression, entity, context, queryBuilder) {
    super(expression, entity, context, queryBuilder);
  }

  /**
   * Adds the prefix of the main entity to the mapping
   * then builds the from statement of the grammar and
   * propagates the entity to the body of the arrow function
   * @param {any} node
   *
   * @memberOf VisitorSelect
   */
  ArrowFunctionExpression(node) {
    check.hasOnlyOneParam(node);
    check.isValidSelectBody(node);
    /**
     * Extract the metadata and the entity of the one
     * that was used to call the select, for example
     * in context.foo.select we get foo
     */
    let metaEntity = this._metaEntities.filter(c =>
      c.entity.name === this._entity.name)[0];
    let entity = metaEntity.entity;
    let meta = metaEntity.meta;

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
  ObjectExpression(node) {
    node.properties.forEach(c => {
      c.entities = node.entities;
      this.visit(c);
    });
  }

  /**
  * Inserts its entities array into its children
  * and visits each one of them.
  * @param {any} node
  *
  * @memberOf VisitorSelect
  */
  ArrayExpression(node) {
    node.elements.forEach(c => {
      c.entities = node.entities;
      this.visit(c);
    });
  }

  /**
   * Identifies new entities on the query and adds them
   * to the mapping. Then it builds the new join statements.
   * @param {any} node
   *
   * @memberOf VisitorSelect
   */
  ObjectProperty(node) {
    check.isValidObjectProperty(node);
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
      let property = node.key.name;
      let propertyEntities = node.entities
        .concat(this._getEntity(node.entities, property));
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
  Identifier(node) {
    check.isInParentMeta(node, this._metaEntities );
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
  _buildFrom(entities, meta) {
    this._queryBuilder.grammar.from = {
      from: meta.class.entity.table,
      prefix: this._queryBuilder.getPrefix(entities, this._metaEntities),
      provider: meta.class.entity.provider
    };
  }
}

