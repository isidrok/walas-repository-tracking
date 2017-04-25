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
    let meta = this._metaEntities
      .filter(c=> c.entity.name === this._entity.name)[0]
      .meta;
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
      let property = node.key.name;
      let table = this._getMeta(property).class.entity.table;
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

