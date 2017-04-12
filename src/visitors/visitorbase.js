import {parse} from 'babylon';
export class VisitorBase
{
      constructor(expression,entity, context, provider){
        this._ast = parse(expression);
        this._entity = entity;
        this._context = context;
        this._provider = provider;
      }
      File(node) {
          this.visit(this, node.program);
      }
      Program(node) {
          this.visit(this, node.body[0]);
      }
      ExpressionStatement(node) {
          this.visit(this, node.expression)
      }
      exec(){
        this.visit(this._ast);
      }
      visit(node){
         let visitor = this[node.type];
         visitor.call(this,node);
      }
}