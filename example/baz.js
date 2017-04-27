import { Entity, Property } from 'walas-decorators';

@Entity({ table: 'BAZ', provider: 'GoogleCloud' })
export class Baz {
  constructor(id, description, phone) {
    this._id = id;
    this._description = description;
    this._phone = phone;
  }
  @Property()
  get id() {
    return this._id;
  }
  get description() {
    return this._description;
  }
  get phone() {
    return this._phone;
  }
}
