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

context.Foo.select('(c=>({id,description,bar:{bazs:{id},description},bazs:{id}}))')
  // .where('(c=>c.id === p0 || p1 === c.Bar.id && c.Bar.Baz.description !== p2)')
  // .where('(c => (c.id1 === p0 || c.Bar.id2 === p1 || c.id3 === p2) && c.id4 === p3 || c.id5 === p4)')
  // .where('(c => c.id1 === p0 && c.Bar.id2 === p1 || c.id3 === p2)')
  // .orderBy('(c=>c.id)')
  // .thenByDescending('(c=>c.Bar.description)')
  // .thenBy('(c=>c.Bar.Baz.description)')
  .exec();

console.log(context);


