var sinon  = require("sinon");
var assert = require("assert");

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
		assert.equal(spy.callCount, 1);
		assert.equal(spy.calledWith, [2]);

		s.add(3, testTasks.norm);
	});

	it("should interrupt task of a lower priority with .cancelSiblings", function() {
		var s = new Interruptible;
		assert.equal(spy.callCount, 1);
		assert.equal(spy.calledWith, [3]);

		s.add(3, testTasks.norm);
	});

	it("should remove internal queue when ", function() {
	});
});
