import { Bar } from './bar';
import { Baz } from './baz';
import { Foo } from './foo';
import { DbContext, DbSet } from '../dist';
export class MyDbContext extends DbContext {
  constructor() {
    super();
    this._foo = new DbSet(Foo, this);
    this._bar = new DbSet(Bar, this);
    this._baz = new DbSet(Baz, this);

  }
  get Foo() {
    return this._foo;
  }
  get Bar() {
    return this._bar;
  }
  get Baz() {
    return this._baz;
  }
}
