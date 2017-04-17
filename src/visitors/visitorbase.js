import { parse } from 'babylon';
export class VisitorBase {
  constructor(expression, entity, context, provider) {
    this._ast = parse(expression);
    this._entity = entity;
    this._context = context;
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
      let obj = {
        prefix: node.prefix,
        table: node.key.name, // look in the metaentities for the name and extract table name from meta
        required: true, // look in the meta of entity, then search for the property pointed by table and see if its required
        relation: 'hasOne', // look in the meta of entity, then search for the property pointed by table and see the type or relation
        provider: 'google', // look again for the meta of the property that creates the relaation with table and extract the provider
        on: ['id', 'id'], // some kind of convention??
        join: [],
      };
      let myParentIsInside = joins[node.parent.prefix];
      let destination = myParentIsInside || this._provider.grammar.join;
      destination.push(obj);
    }
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
