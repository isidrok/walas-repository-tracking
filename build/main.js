'use strict';

var _bar = require('./bar');

var _baz = require('./baz');

var _foo = require('./foo');

var _mydbcontext = require('./mydbcontext');

var _walasMetaApi = require('walas-meta-api');

var context = new _mydbcontext.MyDbContext();
var baz1 = new _baz.Baz(3, 'baz1', 333);
var baz2 = new _baz.Baz(4, 'baz2', 444);
var bar = new _bar.Bar(2, 'bar', 222, [baz1, baz2]);
var foo = new _foo.Foo(1, 'foo', 111, bar);

context.Foo.add(foo);
context.Bar.add(bar);
context.Baz.add(baz1);
context.Baz.add(baz2);

context.Foo.select('(c=>({id,description,Bar:{id,description}}))').orderBy('(c=>c.id)').thenByDescending('(c=>c.Bar.description)').thenBy('(c=>c.Bar.Baz.description)');
context.Foo.exec();

console.log(context);