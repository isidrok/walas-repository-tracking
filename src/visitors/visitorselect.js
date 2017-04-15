import { VisitorBase } from './visitorbase';
export class VisitorSelect extends VisitorBase {
    constructor(ast, entity, context, provider) {
        super(ast, entity, context, provider);
    }
    ArrowFunctionExpression(node) {
        node.body.parent = node;
        this.visit(node.body);
    }
    ObjectExpression(node) {
        node.prefix = this._provider.nextPrefix();
        //if firstPrefix --> resolveFrom
        node.properties.forEach(c => {
            c.parent = node;
            c.prefix = node.prefix;
            this.visit(c);
        });
    }
    ArrayExpression(node) {
        node.elements.forEach(c => {
            c.parent = node;
            c.prefix = node.prefix;
            this.visit(c);
        });
    }
    ObjectProperty(node) {
        //let meta= getmeta() this.check(meta)
        node.value.prefix = node.prefix;
        if (node.value.type === 'ObjectExpression' || node.value.type === 'ArrayExpression') {
            node.value.parent = node;
            this._buildJoin(node);
        }
        //now we are inside a node who belongs to the main entity, thus its prefix
        //is the one related to it and we can build the from statement.
        else this._buildFrom(node);
        this.visit(node.value);
    }

    Identifier(node) {
        this._provider.grammar.select.push({ prefix: node.prefix, field: node.name });
    }

    _buildFrom(node) {
        //
        if (this._provider.grammar.from.from) return;
        let table = this._entity.name; //entity.meta.class.entity.table
        let prefix = node.prefix;
        this._provider.grammar.from = { from: table, prefix: prefix };
    }

    _buildJoin(node) {
        /*
        If node.parent.prefix is in the array of joins and node.prefix is different
        we go into the joins array of the parent node.

        If node.parent.prefix is not in the array of joins then we are in the main join,
        and we push the object in the grammar joins.
        */
        let joins = this._provider.grammar.join;
        let isParent = joins.some(c => {
            return c.prefix !== node.parent.prefix;
        });
        if (!isParent) this._provider.grammar.join.push({ prefix: node.prefix, join: [] });
    }
}