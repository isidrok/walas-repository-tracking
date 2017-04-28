'use strict';

var _bar = require('./bar');

var _baz = require('./baz');

var _foo = require('./foo');

var _mydbcontext = require('./mydbcontext');

var context = new _mydbcontext.MyDbContext();
var baz1 = new _baz.Baz(3, 'baz1', 333);
var baz2 = new _baz.Baz(4, 'baz2', 444);
var bar = new _bar.Bar(2, 'bar', 222, [baz1, baz2]);
var foo = new _foo.Foo(1, 'foo', 111, bar);

context.Foo.add(foo);
context.Bar.add(bar);
context.Baz.add(baz1);
context.Baz.add(baz2);
var id = 24;
context.Foo
// .select('(c=>({id,description,bar:{bazs:{id},description},bazs:{id}}))')
.select({
  expression: 'c=>({id, bar: {id}})',
  initializer: function initializer() {
    return { id: arguments.length <= 0 ? undefined : arguments[0], bar: { id: arguments.length <= 1 ? undefined : arguments[1] } };
  }
}).where(function (p0, p1) {
  var booleanExpression = {
    params: {}
  };
  booleanExpression.params.p0 = p0;
  booleanExpression.params.p1 = p1;
  booleanExpression.expression = 'c=> c.id === p0 || c.bar.id === p1';
  return booleanExpression;
}(10, id))
// .where('(c => (c.description === p0 || c.bar.id === p1 || c.id === p2) && c.bar.bazs.description === p3 || c.bazs.description === p4)')
// .where('(c => c.id === p0 && c.bar.id === p1 || c.bazs.description === p2)')
.orderBy('c => c.id').thenByDescending('c => c.bar.description')
// .thenBy('(c=>c.bar.bazs.description)')
.exec();

console.log(context);