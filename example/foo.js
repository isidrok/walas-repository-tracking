import { Bar } from './bar';
import { HasOne, Entity, Required } from 'walas-decorators';

@Entity({ table: 'FOO', provider: 'MySQL' })
export class Foo {
  constructor(id, description, phone, bar) {
    this._id = id;
    this._description = description;
    this._phone = phone;
    this._bar = bar;
  }
  get id() {
    return this._id;
  }
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
}
