import { VisitorBase } from './visitorbase';
export class VisitorOrder extends VisitorBase {
  constructor(order, entity, context, provider) {
    super(order.expression, entity, context, provider);
    this._type = order.type;
  }
  ArrowFunctionExpression(node) {
    node.body.prefix = this._provider.nextPrefix();
    node.body.property.build = true;
    if (node.body.object.type === 'Identifier')
      node.body.property.parent = node.body;
    this.visit(node.body);
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
    if (node.build) this._buildOrder(node);
    else this._buildJoin(node);
  }
  _buildOrder(node) {
    let order = {
      prefix: node.parent.prefix,
      field: node.name,
      type: this._type,
      parent: node.parent
    };
    this._provider.grammar.order.push(order);
  }
}

