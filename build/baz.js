'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Baz = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _walasDecorators = require('walas-decorators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Baz = exports.Baz = (_dec = (0, _walasDecorators.Entity)({ table: 'BAZ', provider: 'GoogleCloud' }), _dec(_class = function () {
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
}()) || _class);