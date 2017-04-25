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
    // if there is a join with the same prefix already built return
    let joins = this._getAllJoins(this._provider.grammar.join);
    let prefix = this._provider.getPrefix(node.path);
    let joinBuilt = joins[prefix];
    if (joinBuilt) return;

    // if there is not a join with that prefix we get the parent of the property
    // to know if the new join must be creaded inside the join array of the grammar
    // or in case the node has a parent, inside its parent join array.
    let path = node.path.split('.');
    let pathToParent = path.slice(0, path.length - 1).join('.');
    let parentHasJoin = pathToParent ? joins[this._provider.getPrefix(pathToParent)] : undefined;

    // TODO: if !parentHasJoin build parent join before continuing with the child join

    // here we get the name of the property that creates the relation,
    // and then find in which metadata is the information about the property stored,
    // it can be in the main entity metadata or in its parent metadata (if it has parent).
    // Once we know this we extract the information about the property (required, relationType
    // and its class name).
    // From the class name we finally get the table name and the provider.
    let propertyName = node.type !== 'Identifier' ? node.key.name : node.name;
    let entityMeta = parentHasJoin ? this._getMeta(this._getParentName(node)) : this._getMeta(this._entity.name);
    let meta = this._getMeta(name);
    let property = this._getProperty(entityMeta, name);

    // finally we build the join object and insert it in the destination,
    // the join of the parent or the join of the grammar
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
  _getMeta(property) {
    let meta = this._metaEntities.filter(c => {
      return c.entity.name === this._entity.name;
    })[0].meta;
    let relationEntity = meta.properties[property].hasOne || meta.properties[property].hasMany;
    return this._metaEntities.filter(c => {
      return c.entity.name === relationEntity.name;
    })[0].meta;
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
  _getAllJoins(join) {
    let obj = {};
    this.__getAllJoins(join, obj);
    return obj;
  }
  __getAllJoins(join, obj) {
    join.reduce((pre, cur) => {
      pre[cur.prefix] = cur.join;
      this._getAllJoins(cur.join, obj);
      return pre;
    }, obj);
  }
}
