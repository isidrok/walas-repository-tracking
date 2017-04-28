import { ProviderSql } from './providersql';
export class Queryable {
  constructor(entity, context) {
    this._entity = entity;
    this._context = context;
    this._expression = { order: [] };
    this._provider = new ProviderSql();
  }
  get provider() {
    return this._provider;
  }
  get expression() {
    return this._expression;
  }
  select(projection) {
    this._expression.select = projection.expression;
    return this;
  }
  where(predicate) {
    this._expression.where = predicate.expression;
    return this;
  }
  orderBy(selector) {
    this._order(selector, 'asc');
    return this;
  }
  orderByDescending(selector) {
    this._order(selector, 'desc');
    return this;
  }
  thenBy(selector) {
    this._order(selector, 'asc');
    return this;
  }
  thenByDescending(selector) {
    this._order(selector, 'desc');
    return this;
  }
  _order(expression, type) {
    this.expression.order.push({ expression: expression, type: type });
  }
  exec() {
    this.provider.exec(this._expression, this._entity, this._context);
  }

}
