import {VisitorBase} from './visitorbase';
export class VisitorWhere extends VisitorBase {
    constructor(expression) {
        super(expression);
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
    exec() {
        this.visit(this._ast);
    }
    visit(node) {
        let visitor = this[node.type];
        visitor.call(this, node);
    }
}