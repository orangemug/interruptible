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
	} else if(this._start + this.duration < t) {
		// We've reached the end
		this.emit("end");
		return true;
	}

	this._fn(t);
}

module.exports = TaskProcess;
