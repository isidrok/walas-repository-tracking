import {ProviderSql} from './providersql';
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
        this._expression.select = projection;
        return this;
    }
    where(predicate) {
        this._expression.where = predicate;
        return this;
    }
    orderBy(selector) {
        this.expression.order.push({ expression: selector, type: 'asc' });
        return this;
    }
    orderByDescending(selector) {
        this.expression.order.push({ expression: selector, type: 'desc' });
        return this;
    }
    thenBy(selector) {
        this.expression.order.push({ expression: selector, type: 'asc' });
        return this;
    }
    thenByDescending(selector) {
        this.expression.order.push({ expression: selector, type: 'desc' });
        return this;
    }
    exec(){
        this.provider.exec(this._expression, this._entity, this._context);
    }

}