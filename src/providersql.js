import { VisitorOrder, VisitorSelect, VisitorWhere } from './visitors';
export class ProviderSql {
  constructor() {
    this._prefix = 't';
    this._counter = 0;
    this._grammar = {
      select: [],
      from: {},
      join: [],
      where: [],
      order: [],
    };
    this._mapping = {};
  }
  get grammar() {
    return this._grammar;
  }
  get mapping() {
    return this._mapping;
  }
  resetPrefix() {
    this._counter = 0;
  }
  nextPrefix() {
    return this._prefix + this._counter++;
  }
  addToMapping(table, path) {
    let container = path ? this._getMappingRoute(path) : this._mapping;
    if (!container[table])
      container[table] = { self: this.nextPrefix() };
  }
  getPrefix(path) {
    return path.split('.').reduce((pre, cur) => {
      return pre[cur];
    }, this._mapping).self;
  }
  _getMappingRoute(path) {
    return path.split('.').reduce((pre, cur) => {
      return pre[cur];
    }, this._mapping);
  }
  exec(expression, entity, context) {
    if (expression.select) {
      let select = new VisitorSelect(expression.select, entity, context, this);
      select.exec();
    }
    if (expression.where) {
      let where = new VisitorWhere(expression.where, entity, context, this);
      where.exec();
    }
    expression.order.map(order =>
      new VisitorOrder(order, entity, context, this).exec());
  }
}
