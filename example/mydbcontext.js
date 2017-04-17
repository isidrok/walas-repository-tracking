import { DbContext, DbSet } from '../src';
export class MyDbContext extends DbContext {
  constructor() {
    super();
  }
  get Foo() {
    return new DbSet(Foo, this);
  }
  get Bar() {
    return new DbSet(Bar, this);
  }
  get Baz() {
    return new DbSet(Baz, this);
  }
}
