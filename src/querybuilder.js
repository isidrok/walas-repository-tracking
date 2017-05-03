import { VisitorOrder, VisitorSelect, VisitorWhere } from './visitors';
export class QueryBuilder {
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
  nextPrefix() {
    return this._prefix + this._counter++;
  }

  /**
   * Adds the tables of the entities specified as arguments
   * into the mapping object, if a table is not found in the path,
   * for example the entities are [foo,bar,baz], and bar has not
   * yet a prefix, then it creates the prefix of bar aswell.
   * Prefixes are stored inside the attribute self of the target object,
   * so the previous example would create the following mapping:
   * mapping:{
   *  foo:{
   *   self:'t1',
   *   bar:{
   *    self: 't2',
   *    baz:{self:'t3'}
   *   }
   *  }
   * }
   * @param {any} entities
   * @param {any} metaEntities
   *
   * @memberOf QueryBuilder
   */
  addToMapping(entities, metaEntities) {
    let tables = this._mapToTables(entities, metaEntities);
    tables.reduce((pre, cur, i) => {
      pre[cur] = pre[cur] || { self: this.nextPrefix() };
      return pre[cur];
    }, this._mapping);
  }
  /**
   * Gets the prefix associated with the last entity
   * inside a sequence of them.
   * @param {any} entities
   * @param {any} metaEntities
   * @return {string} prefix of the table of the last entity in entities.
   *
   * @memberOf QueryBuilder
   */
  getPrefix(entities, metaEntities) {
    let tables = this._mapToTables(entities, metaEntities);
    return tables.reduce((pre, cur) => {
      return pre[cur];
    }, this._mapping).self;
  }
  /**
   * Maps an array of entities to its tables stracted
   * form the metadata of each of the entities.
   * @param {any} entities
   * @param {any} metaEntities
   * @return {string} table associated with the las entity in entities.
   *
   * @memberOf QueryBuilder
   */
  _mapToTables(entities, metaEntities) {
    return entities.map(entity =>
      metaEntities.filter(metaEntity =>
         metaEntity.entity.name === entity.name
      )[0].meta.class.entity.table
    );
  }
  /**
   * Visits all the attributes of the expression
   * in order to build the grammar object
   * @param {any} expression contains the queries
   * @param {any} entity target entity of the queries
   * @param {any} context DbContext where the entity is stored
   *
   * @memberOf QueryBuilder
   */
  exec(expression, entity, context) {
    /*
     * TODO: if select is of the form:
     *  select(c => {c}) or select(c => {bar})
     * or if there is no select, add all
     * properties of c (main entity) or bar
     * to the select expression, add all the
     * properties of the entities that are in
     * the include of the main entity aswell.
     */
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
