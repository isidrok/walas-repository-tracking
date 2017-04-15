import {parse} from 'babylon';
export class VisitorBase
{
      constructor(expression, entity, context, provider){
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
          this.visit(node.expression)
      }
      CallExpression(node){
          this.visit(node.arguments[0]);
      }
      exec(){
        this.visit(this._ast);
      }
      visit(node){
         let visitor = this[node.type];
         visitor.call(this,node);
      }
}