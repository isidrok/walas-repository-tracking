import { parse } from 'babylon';
import { getMetaEntities } from 'walas-meta-api';
import { check } from './check';
export class VisitorBase {
  constructor(expression, entity, context, provider) {
    this._ast = parse(expression);
    this._entity = entity;
    this._metaEntities = getMetaEntities(context.constructor);
    this._provider = provider;
    this._arrowFuncId = null;
  }
  File(node) {
    this.visit(node.program);
  }
  Program(node) {
    this.visit(node.body[0]);
  }
  ExpressionStatement(node) {
    this.visit(node.expression);
  }
  CallExpression(node) {
    this.visit(node.arguments[0]);
  }
  exec() {
    this.visit(this._ast);
  }
  visit(node) {
    let visitor = this[node.type];
    visitor.call(this, node);
  }

  /**
   * Adds a join objet to the correct join array,
   * first is gets the prefix of the entity the property belongs to,
   * then creates the join object and extracts all the joins of the grammar.
   * If there is already an array of joins with that prefix it is appended
   * to it, otherwise it is added to the joins of the grammar object.
   * @param {any} node
   * @param {any} nextEntities
   * @memberOf VisitorBase
   */
  buildJoin(node, nextEntities) {
    let prefix = this._provider.getPrefix(nextEntities, this._metaEntities);
    let joins = this._getAllJoins(this._provider.grammar.join);
    if (joins[prefix]) return;

    let entities = node.entities;
    let parent = entities[entities.length - 1];
    let property = node.type !== 'Identifier' ? node.key.name : node.name;
    let parentPrefix = this._provider.getPrefix(entities, this._metaEntities);
    let joinObj = this._getjoinObject(parent, property, prefix);
    let target = joins[parentPrefix] ? joins[parentPrefix] : this._provider.grammar.join;
    target.push(joinObj);
  }
  /**
   * Builds a join object taking information form:
   *  -Property parent: contains if the property
   *  is required or not and the kind of relation.
   *  -Property entity metainformation: contains the provider
   *  and the table of the entity to which the property belongs to.
   *
   * Then it builds a join object whose attributes are:
   *  table: table of the entity the property belongs to,
   *  prefix: prefix associated to that table in the mapping,
   *  relation: type of the relation between that entity and its parent,
   *  required: if the property is required or not,
   *  on: array of attributes that are common in both entities,
   *  join: empty array to store possible future joins
   *
   * @param {any} parent
   * @param {any} property
   * @param {any} prefix
   * @return {object} join object with the properties described
   * previously.
   * @memberOf VisitorBase
   */
  _getjoinObject(parent, property, prefix) {
    let prop = this._metaEntities.filter(c =>
      c.entity.name === parent.name)[0]
      .meta.properties[property];
    let relation = prop.hasOne || prop.hasMany;
    let entity = this._metaEntities.filter(c =>
      c.entity.name === relation.name)[0]
      .meta.class.entity;
    return {
      table: entity.table,
      prefix: prefix,
      relation: prop.hasOne ? 'hasOne' : 'hasMany',
      required: prop.required,
      on: ['id', 'id'],
      join: []
    };
  }

  /**
   * Searches for the entity that a given property
   * belongs to, in the metadata of the parent of the
   * entity we are currently working with.
   *
   * @param {any} entities
   * @param {any} property
   * @return {object} entity to which the property
   * belongs to.
   * @memberOf VisitorBase
   */
  getEntity(entities, property) {
    let node = { entities: entities, name: property };
    check.isInParentMeta(node, this._metaEntities);
    let parent = entities[entities.length - 1];
    let parentMeta = this._metaEntities.filter(c =>
      c.entity.name === parent.name)[0].meta;
    let propMeta = parentMeta.properties[property];
    check.hasRelationData(propMeta);
    let relation = propMeta.hasOne || propMeta.hasMany;
    return relation;
  }
  /**
   * Searches recursively for all the join arrays in the grammar and stores
   * them using the prefix as a key so they can be managed easily.
   *
   * @param {any} join
   * @return {object} whose keys are the prefixes of the tables inside the
   * join array and are pointing to the specific array of that join
   *
   * @memberOf VisitorBase
   */
  _getAllJoins(join) {
    let obj = {};
    this.__getAllJoins(join, obj);
    return obj;
  }
  __getAllJoins(join, obj) {
    join.reduce((pre, cur) => {
      pre[cur.prefix] = cur.join;
      this.__getAllJoins(cur.join, obj);
      return pre;
    }, obj);
  }
}
