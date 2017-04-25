import { VisitorBase } from './visitorbase';
export class VisitorWhere extends VisitorBase {
  constructor(expression, entity, context, provider) {
    super(expression, entity, context, provider);
  }
  visit(node, expression) {
    let visitor = this[node.type];
    visitor.call(this, node, expression);
  }
  ArrowFunctionExpression(node) {
    let expression = this._provider.grammar.where;
    this.visit(node.body, expression);
  }
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
