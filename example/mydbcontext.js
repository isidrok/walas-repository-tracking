import { Bar } from './bar';
import { Baz } from './baz';
import { Foo } from './foo';
import { DbContext, DbSet } from '../dist';
import { getMetaEntities } from 'walas-meta-api';
export class MyDbContext extends DbContext {
  constructor() {
    super();
    this._foo = new DbSet(Foo, this);
  }
  get Foo() {
    return this._foo;
  }
  get Bar() {
    return new DbSet(Bar, this);
  }
  get Baz() {
    return new DbSet(Baz, this);
  }
}
