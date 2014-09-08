var EventEmitter = require('events').EventEmitter;
var util = require("util");

var propagate = require("propagate");

var contains = require("lodash").contains;
var TaskProcess = require("./task-process");


function Task(def) {
  var self = this;
  this._name = def.name;
  this._states = {};

  // Disabled by default
  this._disabled = true;

  if(def.run) {
    var t = new TaskProcess(def.run);
    this._states.running = t;

    if(def.interrupt) {
      t.on("end", function() {
        self.interrupt();
      });
    } else {
      self.emit("end");
    }
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
  if(this._disabled) {
    return;
  }

  var s = this._states[this._state];
  if(s) {
    try {
      s.exec(t);
    } catch(err) {
      if(this._state === "running") {
        this._state = "interrupt";
      } else {
        this.emit("end");
      }
    }
  }
}

Task.prototype.start = function() {
  // Only allowed to start tasks in running state
  if(this._state === "running") {
    this._disabled = false;
  } else {
    this.emit("end");
  }
};

Task.prototype.interrupt = function() {
  // Just end the task if disabled.
  if(this._disabled) {
    this.emit("end");
  } else {
    this._state = "interrupt";
  }
};

Task.prototype.toJSON = function() {
  return {
    name:  this._name,
    state: this._state
  };
};

module.exports = Task;
