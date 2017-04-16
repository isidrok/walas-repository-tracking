import { VisitorBase } from './visitorbase';
export class VisitorSelect extends VisitorBase {
    constructor(expression, entity, context, provider) {
        super(expression, entity, context, provider);
    }
    ArrowFunctionExpression(node) {
        //The entire body of the arrow function will be flagged with a 
        //prefix which will be shared by all the attributes that directly
        //belong to the main entity, so this is the moment to build the
        //from statement, in addition, this ensures that the from is not build
        //more than once since only one arrow function expression will be processed.
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
        if (node.value.type !== 'Identifier') {
            //Here we have an object property which is a container for other object
            //properties, so we know that it doesn't belong to the main entity, therefore
            //we must assign this attribute a new prefix and build a join statement,
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

    _buildFrom(firstPrefix) {
        let table = this._entity.name; //this._entity.meta.class.entity.table
        let provider = 'amazon'; //this._entity.meta.class.entity.provider
        this._provider.grammar.from = { from: table, prefix: firstPrefix, provider: provider };
    }
    _buildJoin(node) {
        //{type:'left',table:'bar',prefix:'b', provider:'google',on:["id","id"],join:[]
        let joins = {};
        this._getAllJoins(this._provider.grammar.join, joins);
        let imInside = joins[node.prefix];
        if (!imInside) {
            let obj = {
                prefix: node.prefix,
                table: node.key.name, //look in the metaentities for the name and extract table name from meta
                required: true, //look in the meta of entity, then search for the property pointed by table and see if its required
                relation: 'hasOne', //look in the meta of entity, then search for the property pointed by table and see the type or relation
                provider: 'google', //look again for the meta of the property that creates the relaation with table and extract the provider
                on: ['id', 'id'],// some kind of convention??
                join: []
            }
            let myParentIsInside = joins[node.parent.prefix];
            let destination = myParentIsInside || this._provider.grammar.join;
            destination.push(obj);
        }
    }
    /**
     * Searches recursively for all the join arrays in the grammar so we can manage them easily
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

