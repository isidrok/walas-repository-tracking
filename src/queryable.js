import { validateEntity, validateContext } from './utils/helperqueryable';
export class Queryable {
    constructor(entity, context) {
        validateEntity(entity);
        validateContext(context);
        this._entity = entity;
        this._context = context;
        this._expression = { order: [] };
        this._provider = null; //TODO:resolve provider

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
    get provider() {
        //TODO
        return this._provider;
    }
    get expression() {
        return this._expression;
    }
}