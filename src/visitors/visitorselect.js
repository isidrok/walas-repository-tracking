import { VisitorBase } from './visitorbase';
export class VisitorSelect extends VisitorBase {
  constructor(expression, entity, context, provider) {
    super(expression, entity, context, provider);
  }
  ArrowFunctionExpression(node) {
    /* The entire body of the arrow function is flagged with a
    prefix which will be shared by all the attributes that directly
    belong to the main entity, so this is the moment to build the
    from statement, in addition, this ensures that the from is not build
    more than once since only one arrow function expression will be processed.*/
    let meta = this._getMeta(this._entity.name);
    let table = meta.class.entity.table;
    this._provider.addToMapping(table);
    this._buildFrom(meta);
    node.body.path = table;
    this.visit(node.body);
  }
  ObjectExpression(node) {
    node.properties.forEach(c => {
      c.path = node.path;
      c.parent = node;
      this.visit(c);
    });
  }
  ArrayExpression(node) {
    node.elements.forEach(c => {
      c.path = node.path;
      c.parent = node;
      this.visit(c);
    });
  }
  ObjectProperty(node) {
    if (node.value.type === 'Identifier')
      node.value.path = node.path;
    else {
      let entityName = node.key.name;
      let table = this._getMeta(entityName).class.entity.table;
      this._provider.addToMapping(table, node.path);
      node.path = node.path ? node.path + '.' + table : table;
      node.value.path = node.path;
      node.value.parent = node;
      this._buildJoin(node);
    }
    this.visit(node.value);
  }
  Identifier(node) {
    this._provider.grammar.select.push({
      prefix: this._provider.getPrefix(node.path),
      field: node.name
    });
  }
  _buildFrom(meta) {
    let table = meta.class.entity.table;
    let provider = meta.class.entity.provider;
    this._provider.grammar.from = {
      from: table,
      prefix: this._provider.getPrefix(table),
      provider: provider
    };
  }
}

// ObjectProperty(node) {
//   node.value.table = node.table;
//   // let meta = getmeta() this.check(meta)
//   if (node.value.type !== 'Identifier') {
//     /* If the type of node.value is an ObjectExpression or an ArrayExpression
//     then the object property doesn't belong to the main entity.
//     We must assign this attribute a new prefix and build a join statement. */
//     node.prefix = this._provider.nextPrefix();
//     this._buildJoin(node);
//     node.value.parent = node;
//     node.value.prefix = node.prefix;
//   }
//   this.visit(node.value);
// }

