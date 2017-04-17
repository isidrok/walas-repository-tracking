import { Bar } from './bar';
import { Baz } from './baz';
import { Foo } from './foo';
import { MyDbContext } from './mydbcontext';

let context = new MyDbContext();
let baz1 = new Baz(3, 'baz1', 333);
let baz2 = new Baz(4, 'baz2', 444);
let bar = new Bar(2, 'bar', 222, [baz1, baz2]);
let foo = new Foo(1, 'foo', 111, bar);

context.Foo.add(foo);
context.Bar.add(bar);
context.Baz.add(baz1);
context.Baz.add(baz2);

context.Foo.select('(c=>({id,description,bar:{id,description,baz:[{phone,id}]}}))');
console.log(context.Foo._expression.select);
context.Foo.exec();

console.log(context);


