import { VisitorBase } from './visitorbase';
export class VisitorWhere extends VisitorBase {
  constructor(expression, entity, context, provider) {
    super(expression, entity, context, provider);
  }
  visit(node, expression, type) {
    let visitor = this[node.type];
    visitor.call(this, node, expression, type);
  }
  ArrowFunctionExpression(node) {
    this.visit(node.body);
  }
  LogicalExpression(node) {
    let lhs = node.left;
    let rhs = node.right;
    let expression = [];
    if (node.extra && node.extra.parenthesized) {
      let left = lhs;
      while (left.left) {
        left.parenthesis = left.parenthesis || [];
        left.parenthesis.push('(');
        left = left.left;
      }
      let right = rhs;
      while (right.right) {
        right.parenthesis = right.parenthesis || [];
        right.parenthesis.push(')');
        right = right.right;
      }
    }

    this.visit(lhs, expression, 'left');
    this.visit(rhs, expression, 'right');

    expression.length === 2 ? expression.splice(1, 0, node.operator) : expression.unshift(node.operator);
    this._provider.grammar.where = this._provider.grammar.where.concat(expression);
  }
  BinaryExpression(node, expression, position) {
    let attr = node.left.type === 'Identifier' ? node.right : node.left;
    let param = node.left.type === 'Identifier' ? node.left : node.right;
    let obj = {};
    let createJoin = true;

    this._provider.resetPrefix();
    node.prefix = this._provider.nextPrefix();

    if (attr.object.type === 'Identifier') {
      attr.object.prefix = node.prefix;
      attr.property.parent = attr.object;
      createJoin = false;
    }

    this.visit(attr);
    obj.prefix = attr.property.parent.prefix;
    obj.field = attr.property.name;
    obj.operator = node.operator;
    obj.param = '@' + param.name;
    obj.parenthesis = node.parenthesis;

    if (createJoin) this._buildJoin(attr.property.parent);
    position === 'left' ? expression.unshift(obj) : expression.push(obj);
  }
  MemberExpression(node) {
    if (node.object.type === 'MemberExpression') {
      node.property.parent = node.object.property;
      this.visit(node.object);
    }
    this.visit(node.property);
  }
  Identifier(node) {
    node.prefix = this._provider.nextPrefix();
  }
}
