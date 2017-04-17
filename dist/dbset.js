'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DbSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _states = require('./states');

var _helperdbset = require('./utils/helperdbset');

var _queryable = require('./queryable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DbSet = exports.DbSet = function (_Queryable) {
  _inherits(DbSet, _Queryable);

  function DbSet(entity, context) {
    _classCallCheck(this, DbSet);

    return _possibleConstructorReturn(this, (DbSet.__proto__ || Object.getPrototypeOf(DbSet)).call(this, entity, context));
  }

  _createClass(DbSet, [{
    key: 'add',
    value: function add(instance) {
      (0, _helperdbset.validateInstance)(instance, this._entity);
      this._context.setState(instance, _states.STATES.ADD);
    }
  }, {
    key: 'update',
    value: function update(instance) {
      (0, _helperdbset.validateInstance)(instance, this._entity);
      this._context.setState(instance, _states.STATES.UPDATE);
    }
  }, {
    key: 'delete',
    value: function _delete(instance) {
      (0, _helperdbset.validateInstance)(instance, this._entity);
      this._context.setState(instance, _states.STATES.DELETE);
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      // TODO: specify everything this method needs to do
    }
  }]);

  return DbSet;
}(_queryable.Queryable);