var EventEmitter = require('events').EventEmitter;
var util = require("util");

var propagate = require("propagate");

var contains = require("lodash").contains;
var TaskProcess = require("./task-process");


function Task(def) {
  this._name = def.name;
  this._states = {};

  if(def.run) {
    var t = new TaskProcess(def.run);
    propagate(t, this);
    this._states.running = t;
  }

  if(def.interrupt) {
    var t = new TaskProcess(def.interrupt);
    propagate(t, this);
    this._states.interrupt = t;
  }

  this._state = "running";
}

util.inherits(Task, EventEmitter);

Task.prototype.exec = function(t) {
  var s = this._states[this._state];
  if(s) {
    s.exec(t);
  }
}

Task.prototype.interrupt = function() {
  this._state = "interrupt";
};

Task.prototype.toJSON = function() {
  return {
    name:  this._name,
    state: this._state
  };
};

module.exports = Task;
