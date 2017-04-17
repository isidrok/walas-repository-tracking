import { Baz } from './baz';
export class Bar {
  constructor(id, description, phone, bazs) {
    this._id = id;
    this._description = description;
    this._phone = phone;
    this._bazs = bazs;
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
  get bazs() {
    return this._bazs;
  }
}
