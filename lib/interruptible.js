var Task = require("./task");


function Interruptible(opts) {
  this._priorityList = {};
  this.timestep = opts.timestep || 1000;
  this._loopHdl = null;
}

Interruptible.prototype._loop = function(t) {
  var now = t || Date.now();

  // Yes I know this inefficient... sorry I'll fix it soon
  var keys = Object.keys(this._priorityList).sort(function(a,b) {
    return a > b;
  });

  keys.forEach(function(list) {
    // Record thing to remove else we'll end up in a mess
    var toRemove = [];

    list.forEach(function(item) {
      // True means it's done.
      if(item.exec(now) === true) {
        toRemove.push(item);
      }
    });

    // Remove stuff
    toRemove.forEach(function(listIdx, offsetIdx) {
      list.splice(listIdx, offsetIdx);
    });
  });
};

Interruptible.prototype.add = function(priority, task) {
  var l = this._priorityList[priority] = this._priorityList[priority] || [];
  var task = new Tast(taskDef);

  var priority = false;
  if(task.cancelSiblings) {
    priority = task.priority;
  } else if(task.cancelLower) {
    priority = task.priority-1;
  }

  if (priority !== false) {
    // interrupt the tasks lower that `priority`
    this._interruptTasks(priority, function() {
      l.push(new Task(taskDef));
    });
  } else {
    l.push(new Task(taskDef));
  }
};

Interruptible.prototype.run = function() {
  this._loopHdl = setInterval(this._loop, this._timestep);
};

Interruptible.prototype.pause = function() {
  clearInterval(this._loopHdl);
};

Interruptible.prototype.running = function() {
  return (!!this._loopHdl);
};


module.exports = Interruptible;
