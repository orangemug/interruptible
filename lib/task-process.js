var EventEmitter = require('events').EventEmitter;
var util = require("util");

function TaskProcess(def) {
	this._fn      = def.fn;
	this.duration = def.duration;
}

util.inherits(TaskProcess, EventEmitter);

TaskProcess.prototype.exec = function(t) {
  if(!this._start) {
    this._start = t;
  } else if(this.duration !== undefined && this._start + this.duration < t) {
    // We've reached the end
    this.emit("end");
    return true;
  }

  var duration = t - this._start;
  this._fn(t, duration);
}

module.exports = TaskProcess;
