var async = require("async");
var Task = require("./task");


function Interruptible(opts) {
  opts = opts || {};
  this._priorityList = {};
  this._timestep = opts.timestep || 100;
  this._loopHdl = null;

  // Bind to self
  this._loop = this._loop.bind(this);
}

Interruptible.prototype._loop = function(t) {
  var plist = this._priorityList
  var now = t || Date.now();

  // Yes I know this inefficient... sorry I'll fix it soon
  var keys = Object.keys(plist).sort(function(a,b) {
    return a > b;
  });

  keys.forEach(function(k) {
    var list = plist[k];
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
    priority = priority+1;
  } else if(taskDef.cancelLower) {
    priority = priority;
  } else {
    // TODO: Eeeewww
    priority = false;
  }

  var t = new Task(taskDef);
  t.on("end", function() {
    var idx = l.indexOf(t);
    if (idx > -1) {
      l.splice(idx, 1);
    }
  });

  if (priority !== false) {
    t.disable();
    // interrupt the tasks lower that `priority`
    this._interruptTasks(priority, function() {
      t.enable();
    });
  }

  l.push(t);
};

/**
 * Interrupt all tasks that are a lower priority.
 * @param {Number} priority
 * @param {Function} done called when all tasks have been interrupted
 */
Interruptible.prototype._interruptTasks = function(priority, done) {
  var tasks = [];

  for(var k in this._priorityList) {
    if(k < priority) {
      this._priorityList[k].forEach(function(task) {
        tasks.push(function(done) {
          task.on("end", done);
          task.interrupt();
        });
      });
    }
  }

  if(tasks.length < 1) {
    done();
  } else {
    // Run the tasks
    async.parallel(tasks, done);
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
