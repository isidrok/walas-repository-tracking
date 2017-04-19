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
    this._provider.resetPrefix();
    node.prefix = this._provider.nextPrefix();
    let lhs = node.left;
    let rhs = node.right;
    let obj = {};
    let createJoin = true;
    if (lhs.type === 'Identifier') {
      if (rhs.object.type === 'Identifier') {
        rhs.object.prefix = node.prefix;
        rhs.property.parent = rhs.object;
        createJoin = false;
      }
      obj.field = rhs.property.name;
      obj.operator = node.operator;
      obj.param = '@' + lhs.name;
      this.visit(rhs);
      obj.prefix = rhs.property.parent.prefix;
      if (createJoin) this._buildJoin(rhs.property.parent);
    } else {
      if (lhs.object.type === 'Identifier') {
        lhs.object.prefix = node.prefix;
        lhs.property.parent = lhs.object;
        createJoin = false;
      }
      obj.field = lhs.property.name;
      obj.operator = node.operator;
      obj.param = '@' + rhs.name;
      this.visit(lhs);
      obj.prefix = lhs.property.parent.prefix;
      if (createJoin) this._buildJoin(lhs.property.parent);
    }
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
