import { VisitorBase } from './visitorbase';
export class VisitorWhere extends VisitorBase {
  constructor(expression, entity, context, provider) {
    super(expression, entity, context, provider);
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
    let expression = this._provider.grammar.where;
    if (expression[0])
      throw new Error('There can be only one where statement');
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
    let parenthesis = node.extra && node.extra.parenthesized;
    let attr = node.left.type === 'Identifier' ? node.right : node.left;
    let param = node.left.type === 'Identifier' ? node.left : node.right;
    let obj = {};

    node.prefix = this._provider.nextPrefix();
    if (attr.object.type === 'Identifier') {
      attr.object.prefix = node.prefix;
      attr.property.parent = attr.object;
    }

    super.visit(attr);

    obj.prefix = attr.property.parent.prefix;
    obj.field = attr.property.name;
    obj.operator = node.operator;
    obj.param = '@' + param.name;
    obj.parenthesis = parenthesis;

    expression.unshift(obj);
  }
  MemberExpression(node) {
    if (node.object.type === 'MemberExpression') {
      node.property.parent = node.object.property;
      super.visit(node.object);
    }
    super.visit(node.property);
  }
  Identifier(node) {
    node.prefix = this._provider.nextPrefix();
  }
}
