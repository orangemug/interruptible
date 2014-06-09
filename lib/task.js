var contains = require("lodash.contains");
var TaskProcess = require("./task-process");


function Task(def) {
  this._name = def.name;
  this._states = {};

  if(def.run) {
    this._states.running = new TaskProcess(def.run);
  }

  if(def.interrupt) {
    this._states.interrupt = new TaskProcess(def.interrupt);
  }

  this._state = "running";
}

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
