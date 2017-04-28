import { VisitorBase } from './visitorbase';
import { check } from './check';
export class VisitorWhere extends VisitorBase {
  constructor(expression, entity, context, queryBuilder) {
    super(expression, entity, context, queryBuilder);
  }

  /**
   * Overwrites visitorBase visit method
   * in order to propagate the expression
   * @param {any} node
   * @param {any} expression
   *
   * @memberOf VisitorWhere
   */
  visit(node, expression) {
    let visitor = this[node.type];
    visitor.call(this, node, expression);
  }
  ArrowFunctionExpression(node) {
    check.hasOnlyOneParam(node);
    check.isValidWhereBody(node);
    this._arrowFuncId = node.params[0].name;
    let expression = this._queryBuilder.grammar.where;
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
  LogicalExpression(node, expression) {
    check.isValidLogicalExpression(node);
    let lhs = node.left;
    let rhs = node.right;

    let parenthesis = node.extra && node.extra.parenthesized;
    let nodeExpression = parenthesis ? [] : expression;

    this.visit(rhs, nodeExpression);
    nodeExpression.unshift(node.operator);
    this.visit(lhs, nodeExpression);

    if (parenthesis)
      expression.unshift(nodeExpression);
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
  BinaryExpression(node, expression) {
    check.isValidBinaryExpression(node);
    let parenthesis = node.extra && node.extra.parenthesized;
    let attr = node.left.type === 'Identifier' ? node.right : node.left;
    let param = node.left.type === 'Identifier' ? node.left : node.right;
    let obj = {};
    if (attr.object.type === 'Identifier') {
      attr.property.noJoin = true;
      attr.property.parent = attr.object;
    }
    /**
     * the property of the attr node is the last elemnt of the expression
     * so it refers to the property to be inserted in the where, it is not
     * a reference to other entity in the system thus we flag it with
     * noJoin = true.
     */
    attr.property.noJoin = true;
    super.visit(attr);
    obj.prefix = this._queryBuilder
      .getPrefix(attr.property.entities, this._metaEntities);
    obj.field = attr.property.name;
    obj.operator = node.operator;
    obj.param = '@' + param.name;
    obj.parenthesis = parenthesis;
    expression.unshift(obj);
  }
  MemberExpression(node) {
    check.isValidMemberExpression(node, this._arrowFuncId);
    if (node.object.type === 'MemberExpression') super.visit(node.object);
    if (node.object.type === 'Identifier') {
      /**
       * if the object is an identifier that means that we are
       * in the first element of the expression, for example
       * in Foo.where(c=>c.bar.id === 10) the current node contains c.bar
       * and the object is c, which represents Foo, so we add the main
       * entity to the node containing c and to the mapping
       */
      node.object.entities = [this._entity];
      this._queryBuilder.addToMapping(node.object.entities, this._metaEntities);
    }
    node.property.parent = node.object.property || node.object;
    super.visit(node.property);
  }

  /**
   * Propagates the entities of the parent
   * of the property to the current node.
   * Then inserts the properties of the
   * expression into the join array of the
   * grammar. The properties flagged with
   * noJoin must be ignored since they are
   * only used for building the where statement.
   * @param {any} node
   *
   * @memberOf VisitorWhere
   */
  Identifier(node) {
    node.entities = node.parent.entities;
    check.isInParentMeta(node, this._metaEntities);
    if (node.noJoin) return;
    let property = node.name;
    let propertyEntities = node.parent.entities
      .concat(this._getEntity(node.parent.entities, property));
    this._queryBuilder.addToMapping(propertyEntities, this._metaEntities);
    this._buildJoin(node, propertyEntities);
    node.entities = propertyEntities;
  }
}
