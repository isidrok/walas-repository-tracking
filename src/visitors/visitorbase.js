import { parse } from 'babylon';
import { getMetaEntities } from 'walas-meta-api';
export class VisitorBase {
  constructor(expression, entity, context, provider) {
    this._ast = parse(expression);
    this._entity = entity;
    this._metaEntities = getMetaEntities(context.constructor);
    this._provider = provider;
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
  _buildJoin(node) {
    // {type:'left',table:'bar',prefix:'b', provider:'google',on:["id","id"],join:[]
    let joins = {};
    this._getAllJoins(this._provider.grammar.join, joins);
    let imInside = joins[node.prefix];
    if (!imInside) {
      let myParentIsInside = joins[node.parent.prefix];
      let entityMeta = myParentIsInside ? this._getMeta(this._getParentName(node)) : this._getMeta(this._entity.name);
      let meta = this._getMeta(node.key.name);
      let property = this._getProperty(entityMeta, node.key.name);
      let obj = {
        prefix: node.prefix,
        table: meta.class.entity.table,
        required: property.required,
        relation: property.hasOne ? 'hasOne' : 'hasMany',
        provider: property.provider || meta.class.entity.provider,
        on: ['id', 'id'], // some kind of convention??
        join: [],
      };

      let destination = myParentIsInside || this._provider.grammar.join;
      destination.push(obj);
    }
  }
  _getMeta(entityName) {
    let entity = (this._metaEntities).filter(c => {
      return c.entity.name === entityName;
    })[0];
    return entity.meta;
  }
  _getProperty(meta, entityName) {
    let props = meta.properties;
    let property = Object.keys(props).filter(key => {
      let relation = props[key].hasMany || props[key].hasOne;
      return relation.name === entityName;
    })[0];
    return props[property];
  }
  _getParentName(node) {
    let name = node.parent.key ? node.parent.key.name : node.parent.parent.key.name;
    return name;
  }
  /**
   * Searches recursively for all the join arrays in the grammar and stores
   * them using the prefix as a key so they can be managed easily.
   * @param {Array} join
   * @param {Object} obj
   */
  _getAllJoins(join, obj) {
    join.reduce((pre, cur) => {
      pre[cur.prefix] = cur.join;
      this._getAllJoins(cur.join, obj);
      return pre;
    }, obj);
  }
}
