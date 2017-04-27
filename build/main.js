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

context.Foo
// .select('(c=>({id,description,bar:{bazs:{id},description},bazs:{id}}))')
// .select('(c=>({id,bad2343azs:{id}}))')
.where('(c=>c.id === p0 || true)')
// .where('(c => (c.description === p0 || c.bar.id === p1 || c.id === p2) && c.bar.bazs.description === p3 || c.bazs.description === p4)')
// .where('(c => c.id === p0 && c.bar.id === p1 || c.bazs.description === p2)')
// .orderBy('(c=>c.id)')
// .thenByDescending('(c=>c.bar.description)')
// .thenBy('(c=>c.bar.bazs.description)')
.exec();

console.log(context);
