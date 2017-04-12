import { VisitorBase } from './visitorbase';
export class VisitorSelect extends VisitorBase {
    constructor(expression) {
        super(expression);
    }
    ArrowFunctionExpression(node) {
        this.visit(this, node.body);
    }
    ObjectExpression(node) {
        node.prefix = this._provider.nextPrefix();
        //if firstPrefix --> resolveFrom
       node.properties.forEach(c => {
            c.prefix = node.prefix;
            this.visit(this, c);
        });
    }
    ArrayExpression(node) {
        node.elements.forEach(c => this.visit(this, c));
    }
    ObjectProperty(node) {
        //let meta= getmeta() this.check(meta)
        node.value.prefix = node.prefix;
        if(node.value === 'ObjectExpression')
            this.resolveJoin(node);
        this.visit(this, node.value);
    }
    Identifier(node) {
        this._provider.grammar.select.push({ prefix: node.prefix, field: node.name });    
    }
    resolveFrom(node){
        /*
        take the prefix of the firt object expression and build
        {from: entity.meta.table, prefix: prefix}
        then set grammar.from to that
        */

    }
    resolveJoin(node){
        /* 
        entity = this._entity;
        relation = node.key.name;
        prefix = node.prefix;
        if prefix is not the prefix of any object in the join array then create a new object with the properties:
            relation: hasMany || hasOne
            table: meta[relation].class.entity.table
            provider: meta[relation].class.entity.provider
            prefix: prefix
            on: []
            join:[]
        grammar.join.push(the object)
        */
    }
   
}