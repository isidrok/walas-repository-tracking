import { VisitorOrder, VisitorSelect, VisitorWhere } from './visitors';
export class ProviderSql {
  constructor() {
    this._prefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
    this._counter = 0;
    this._grammar = {
      select: [],
      from: {},
      join: [],
      where: [],
      order: [],
    };
  }
  get grammar() {
    return this._grammar;
  }
  resetPrefix() {
    this._counter = 0;
  }
  nextPrefix() {
    return this._prefixes[this._counter++];
  }
  exec(expression, entity, context) {
    if (expression.select) {
      let select = new VisitorSelect(expression.select, entity, context, this);
      select.exec();
    }
    // let where = new VisitorWhere(expression.where, entity, context, this);
    // where.exec();
    expression.order.map(order =>
      new VisitorOrder(order, entity, context, this).exec());
  }
}
