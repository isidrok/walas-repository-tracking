import { DbContext, DbSet } from './src';
class Foo {
  constructor(id, phone) {
    this._id = id;
    this._phone = phone;
  }
  get id() {
    return this._id;
  }
  set phone(phone) {
    this._phone = phone;
  }
  get phone() {
    return this._phone;
  }
}

class MyDbContext extends DbContext {
  constructor() {
    super();
  }
  get Foo() {
    return new DbSet(Foo, this);
  }
}

let context = new MyDbContext();
let foo = new Foo(1, 123456789);
context.Foo.add(foo);
