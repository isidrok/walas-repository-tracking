'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyDbContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bar = require('./bar');

var _baz = require('./baz');

var _foo = require('./foo');

var _dist = require('../dist');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyDbContext = exports.MyDbContext = function (_DbContext) {
  _inherits(MyDbContext, _DbContext);

  function MyDbContext() {
    _classCallCheck(this, MyDbContext);

    var _this = _possibleConstructorReturn(this, (MyDbContext.__proto__ || Object.getPrototypeOf(MyDbContext)).call(this));

    _this._foo = new _dist.DbSet(_foo.Foo, _this);
    return _this;
  }

  _createClass(MyDbContext, [{
    key: 'Foo',
    get: function get() {
      return this._foo;
    }
  }, {
    key: 'Bar',
    get: function get() {
      return new _dist.DbSet(_bar.Bar, this);
    }
  }, {
    key: 'Baz',
    get: function get() {
      return new _dist.DbSet(_baz.Baz, this);
    }
  }]);

  return MyDbContext;
}(_dist.DbContext);