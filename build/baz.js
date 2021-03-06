'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Baz = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class, _desc, _value, _class2;

var _walasDecorators = require('walas-decorators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var Baz = exports.Baz = (_dec = (0, _walasDecorators.Entity)({ table: 'BAZ', provider: 'GoogleCloud' }), _dec2 = (0, _walasDecorators.Property)(), _dec(_class = (_class2 = function () {
  function Baz(id, description, phone) {
    _classCallCheck(this, Baz);

    this._id = id;
    this._description = description;
    this._phone = phone;
  }

  _createClass(Baz, [{
    key: 'id',
    get: function get() {
      return this._id;
    }
  }, {
    key: 'description',
    get: function get() {
      return this._description;
    }
  }, {
    key: 'phone',
    get: function get() {
      return this._phone;
    }
  }]);

  return Baz;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'id', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'id'), _class2.prototype)), _class2)) || _class);