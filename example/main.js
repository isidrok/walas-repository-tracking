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
let id = 24;
context.Foo
// .select('(c=>({id,description,bar:{bazs:{id},description},bazs:{id}}))')
.select(c=>({id, bar: {id}}))
  .where(c=> c.id === 10 || c.bar.id === id)
  // .where('(c => (c.description === p0 || c.bar.id === p1 || c.id === p2) && c.bar.bazs.description === p3 || c.bazs.description === p4)')
  // .where('(c => c.id === p0 && c.bar.id === p1 || c.bazs.description === p2)')
  .orderBy(c=>c.id)
  .thenByDescending(c=>c.bar.description)
  // .thenBy('(c=>c.bar.bazs.description)')
  .exec();

console.log(context);


