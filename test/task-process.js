var sinon  = require("sinon");
var assert = require("assert");

var TaskProcess = require("../lib/task-process");

describe('TaskProcess', function() {
	it('should execute fn when still in alloted time', function() {
		var fnSpy = sinon.spy();
		var t = new TaskProcess({
			duration: 1000,
			fn: fnSpy
		});

		t.exec(4000);
		t.exec(4999);

		assert.equal(fnSpy.callCount,  2);
	});

	it('should emit \'end\' once alloted time is in past', function() {
		var fnSpy  = sinon.spy();
		var endSpy = sinon.spy();

		var t = new TaskProcess({
			duration: 3000,
			fn: fnSpy
		});

		t.on("end", endSpy);

		t.exec(4000);
		t.exec(8000);

		assert.equal(fnSpy.callCount,  1);
		assert.equal(endSpy.callCount, 1);
	});

	it('should execute at least once', function() {
		var fnSpy = sinon.spy();
		var t = new TaskProcess({
			duration: 0,
			fn: fnSpy
		});

		t.exec(4000);
		assert.equal(fnSpy.callCount, 1);
	});
});
