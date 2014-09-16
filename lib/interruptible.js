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
  // `cancelSiblings` is just so the task priorities read a bit nicer
  if(taskDef.cancelSiblings) {
    priority = priority+1;
  } else if(taskDef.cancelLower) {
    priority = priority;
  } else {
    // All others just get assigned zero
    priority = 0;
  }

  // Add the task to the system
  var l = this._priorityList[priority] = this._priorityList[priority] || [];
  var t = new Task(taskDef);
  l.push(t);

  // When we end, remove ourselves from the list.
  t.on("end", function() {
    var idx = l.indexOf(t);
    if (idx > -1) {
      l.splice(idx, 1);
    }
  });


  // check interrupt
  this._checkInterrupt(function() {
    // Start ourselves, this will fail if we're already removed from the list
    t.start();
  });

};

/**
 * Interrupt tasks based on current state of the queues
 * @param {Function} done called when all tasks have been interrupted
 */
Interruptible.prototype._checkInterrupt = function(done) {
  var tasks = [];

  // Remove empty lists first, we don't care about these
  for(var k in this._priorityList) {
    if(this._priorityList[k].length < 1) {
      delete this._priorityList[k];
    }
  }

  // Get a list of priorities (really inefficient)
  var priorities = Object.keys(this._priorityList).sort();

  // Only keep the top priority, dump the rest
  priorities.pop();
  priorities.forEach(function(priority) {
    this._priorityList[priority].forEach(function(task) {
      tasks.push(function(done) {
        task.on("end", done);
        task.interrupt();
      });
    });
  }, this);


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
