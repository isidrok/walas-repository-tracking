import { VisitorBase } from './visitorbase';
export class VisitorSelect extends VisitorBase {
    constructor(expression, entity, context, provider) {
        super(expression, entity, context, provider);
    }
   ArrowFunctionExpression(node) {
        let firstPrefix = this._provider.nextPrefix();
        node.body.prefix = firstPrefix;
        this._buildFrom(firstPrefix);
        this.visit(node.body);
    }
    ObjectExpression(node) {
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
        node.value.prefix = node.prefix;  
        //let meta= getmeta() this.check(meta)
        if (node.value.type !== 'Identifier'){
            node.prefix = this._provider.nextPrefix();
            this._buildJoin(node);
            node.value.parent = node;
            node.value.prefix = node.prefix;
        }
        this.visit(node.value);    
    }
    Identifier(node) {
        this._provider.grammar.select.push({ prefix: node.prefix, field: node.name });
    }

    _buildFrom(firstPrefix){
        let table = this._entity.name; //this._entity.meta.class.entity.table
        let provider = this._entity.name + 'provider'; //this._entity.meta.class.entity.provider
        this._provider.grammar.from = {from: table, prefix: firstPrefix, provider: provider};
    }
    _buildJoin(node){
        //{type:'left',table:'bar',prefix:'b', provider:'google',on:["id","id"],join:[]
        let prefix = node.prefix;
        let table = node.key.name; //look in the metaentities for the name and extract table name from meta?
        let required = true; //look in the meta of entity, then search for the property pointed by table and see if its required
        let relation = 'hasOne'; //look in the meta of entity, then search for the property pointed by table and see the type or relation
        let provider = 'google'; //look again for the meta of the property that creates the relaation with table and extract the provider
        let on = ['id','id']; // some kind of convention??
        let join = [];
        let obj = {prefix:prefix, table:table, required:required, relation:relation, provider:provider, on:on, join:join};
        let joins = this._provider.grammar.join;
        let imInside = joins.filter(c=>c.prefix === node.prefix)[0];
        if(!imInside){
          let myParentIsInside = joins.filter(c=>c.prefix === node.parent.prefix)[0];
          let destination = myParentIsInside || this._provider.grammar;
          destination.join.push(obj);
        } 
    }     
}