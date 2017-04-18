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
    this.visit(lhs, expression, 'left');
    this.visit(rhs, expression, 'right');
    expression.splice(1, 0, node.operator);
    this._provider.grammar.where = expression.concat(this._provider.grammar.where);
  }
  BinaryExpression(node, expression, position) {
    let lhs = node.left;
    let rhs = node.right;
    let obj = {};
    if (lhs.type === 'Identifier') {
      obj.field = rhs.property.name;
      obj.operator = node.operator;
      obj.param = '@' + lhs.name;
    } else {
      obj.field = lhs.property.name;
      obj.operator = node.operator;
      obj.param = '@' + rhs.name;
    }
    // obj.prefix = ??;
    position === 'left' ? expression.unshift(obj) : expression.push(obj);
  }
}
