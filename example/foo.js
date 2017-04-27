import { Bar } from './bar';
import { Baz } from './baz';
import { HasOne, HasMany, Entity, Required, Property } from 'walas-decorators';

@Entity({ table: 'FOO', provider: 'MySQL' })
export class Foo {
  constructor(id, description, phone, bar) {
    this._id = id;
    this._description = description;
    this._phone = phone;
    this._bar = bar;
  }
  @Property()
  get id() {
    return this._id;
  }
  @Property()
  get description() {
    return this._description;
  }
  get phone() {
    return this._phone;
  }
  @Required()
  @HasOne(Bar)
  get bar() {
    return this._bar;
  }
   @Required()
  @HasMany(Baz)
  get bazs() {
    return this._bar;
  }
}
