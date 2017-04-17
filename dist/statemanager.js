'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _states = require('./states');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StateManager = exports.StateManager = function () {
  function StateManager() {
    _classCallCheck(this, StateManager);

    this._entries = [];
  }

  _createClass(StateManager, [{
    key: 'reset',
    value: function reset() {
      this._entries = [];
    }
  }, {
    key: 'addEntry',
    value: function addEntry(entry) {
      if (entry.state === _states.STATES.ADD && this._isInEntries(entry)) this._changeEntriesWithId(entry);else if (entry.state !== _states.STATES.ADD) this._changeEntriesStateWithId(entry.entity.id, entry.state);
      this._entries.push(entry);
    }
  }, {
    key: '_isInEntries',
    value: function _isInEntries(thisEntry) {
      var _this = this;

      this._entries.some(function (entry) {
        return _this._isSameId(thisEntry.entity.id, entry.entity.id);
      });
    }
  }, {
    key: '_changeEntriesStateWithId',
    value: function _changeEntriesStateWithId(id, state) {
      var _this2 = this;

      this._entries = this._entries.map(function (entry) {
        entry.state = _this2._isSameId(id, entry.entity.id) ? state : entry.state;
      });
    }
  }, {
    key: '_changeEntriesWithId',
    value: function _changeEntriesWithId(newEntry) {
      var _this3 = this;

      this._entries = this._entries.map(function (entry) {
        entry = _this3._isSameId(newEntry.entity.id, entry.entity.id) ? newEntry : entry;
      });
    }
  }, {
    key: '_isSameId',
    value: function _isSameId(id1, id2) {
      var keys1 = Object.keys(id1);
      var keys2 = Object.keys(id2);
      if (keys1.length != keys2.length) return false;
      var filterLength = keys1.filter(function (key) {
        return id2[key] != id1[key];
      }).length;
      return keys1.leght === filterLength;
    }
  }, {
    key: 'entries',
    get: function get() {
      return this._entries;
    }
  }]);

  return StateManager;
}();