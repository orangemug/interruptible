var sinon  = require("sinon");
var assert = require("assert");

var size = require("lodash.size");

var Interruptible = require("../");

var testTasks = {
	norm: {
		name: "norm"
	},
	siblings: {
		name: "siblings",
		cancelSiblings: true,
	},
	lower: {
		name: "lower",
		cancelLower: true
	},
	both: {
		name: "both",
		cancelSiblings: true,
		cancelLower: true
	}
};


describe('Interruptible', function() {

	// TODO: Bad test
	it('should add items', function() {
		var s = new Interruptible;
		s.add(1, testTasks.norm);

		assert.equal(size(s._priorityList), 1);
		assert.equal(size(s._priorityList[1]), 1);
	});

	it("should interrupt task of a lower priority with .cancelLower", function() {
		var s = new Interruptible;
    var spy = sinon.spy(s, "_interruptTasks");

		s.add(3, testTasks.lower);

		assert.equal(spy.callCount, 1);
		assert(spy.calledWith(2));

    s._interruptTasks.restore();
	});

	it("should interrupt task of a lower priority with .cancelSiblings", function() {
		var s = new Interruptible;
    var spy = sinon.spy(s, "_interruptTasks");

		s.add(3, testTasks.siblings);

		assert.equal(spy.callCount, 1);
		assert(spy.calledWith(3));

    s._interruptTasks.restore();
	});

	it("should remove internal queue when end is fired", function() {
    // TODO
	});

	it("#_interruptTasks should call interrupt on each task in a lower priority queue", function() {
    // TODO
	});

	it("#_loop should call 'exec' for each task", function() {
		var s = new Interruptible;
    s.add(1, testTasks.norm);

  });

});
