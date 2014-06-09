var sinon      = require("sinon");
var assert     = require("assert");
var proxyquire = require("proxyquire");

var Task = proxyquire('../lib/task', {
	'./task-process': require("./mocks/task-process")
});

describe('Task', function(){

	it('should call `run` on #exec if defined', function() {
		var runSpy = sinon.spy();

		var t = new Task({
			name: "task1",
			run: {
				fn: runSpy
			}
		});
		t.exec();
		assert.equal(runSpy.callCount, 1);
	});

	it('should call `interrupt` on #exec if inturpted and defined', function() {
		var runSpy      = sinon.spy();
		var interruptSpy = sinon.spy();

		var t = new Task({
			name: "task1",
			run: {
				fn: runSpy
			},
			interrupt: {
				fn: interruptSpy
			}
		});
		t.interrupt();
		t.exec();

		assert.equal(runSpy.callCount, 0);
		assert.equal(interruptSpy.callCount, 1);
	});

	it('should return state #toJSON', function() {
		var t = new Task({
			name: "task1"
		});

		assert(t.toJSON(), {
			name: "task1",
			state: "running"
		});

		t.interrupt();

		assert(t.toJSON(), {
			name: "task1",
			state: "inturpted"
		});
	});
});

