var async = require("async");
var Task = require("./task");


function Interruptible(opts) {
  opts = opts || {};
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
    list.forEach(function(item) {
      // True means it's done.
      item.exec(now);
    });
  });
};

Interruptible.prototype.add = function(priority, taskDef) {
  var l = this._priorityList[priority] = this._priorityList[priority] || [];
  var task = new Task(taskDef);

  if(taskDef.cancelSiblings) {
    priority = priority;
  } else if(taskDef.cancelLower) {
    priority = priority-1;
  } else {
    // TODO: Eeeewww
    priority = false;
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

/**
 * Interrupt all tasks that are a lower priority.
 * @param {Number} priority
 * @param {Function} done called when all tasks have been interrupted
 */
Interruptible.prototype._interruptTasks = function(priority, done) {
  var tasks = [];

  for(var k in this._priorityList) {
    if(k < priority) return;

    this._priorityList[k].forEach(function(task) {
      tasks.push(function(done) {
        task.on("interrupt", done);
        task.interrupt();
      });
    });
  }

  // Run the tasks
  async.parallel(tasks, done);
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
