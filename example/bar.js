import { Baz } from './baz';
import { Entity, HasMany, Property } from 'walas-decorators';

@Entity({ table: 'BAR', provider: 'MongoDB' })
export class Bar {
  constructor(id, description, phone, bazs) {
    this._id = id;
    this._description = description;
    this._phone = phone;
    this._bazs = bazs;
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
  @HasMany(Baz)
  get bazs() {
    return this._bazs;
  }
}
