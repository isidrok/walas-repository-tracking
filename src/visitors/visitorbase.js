import { parse } from 'babylon';
import { getMetaEntities } from 'walas-meta-api';
export class VisitorBase {
  constructor(expression, entity, context, provider) {
    this._ast = parse(expression);
    this._entity = entity;
    this._metaEntities = getMetaEntities(context.constructor);
    this._provider = provider;
    // this._provider.resetPrefix();
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
    let prefix = this._provider.getPrefix(node.path);
    let imInside = joins[prefix];

    if (imInside) return;

    let name = node.type !== 'Identifier' ? node.key.name : node.name;

    let path = node.path.split('.');
    let parentPath = path.slice(0, path.length - 1).join('.');
    let myParentIsInside = parentPath ? joins[this._provider.getPrefix(parentPath)] : undefined;

    let entityMeta = myParentIsInside ? this._getMeta(this._getParentName(node)) : this._getMeta(this._entity.name);
    let meta = this._getMeta(name);
    let property = this._getProperty(entityMeta, name);

    let obj = {
      prefix: prefix,
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
  _getParentName(node) {
    let name;
    if (node.type !== 'Identifier')
      name = node.parent.key ? node.parent.key.name : node.parent.parent.key.name;
    else name = node.parent.name;
    return name;
  }
  //coger propiedades del meta de entidad principal, de ahí sacar la relación y con ella sacar la clase a la que apunta y sacar su meta
  _getMeta(entityName) {
    let entity = this._metaEntities.filter(c => {
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
