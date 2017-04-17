'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dbcontext = require('./dbcontext');

Object.keys(_dbcontext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dbcontext[key];
    }
  });
});

var _dbset = require('./dbset');

Object.keys(_dbset).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dbset[key];
    }
  });
});