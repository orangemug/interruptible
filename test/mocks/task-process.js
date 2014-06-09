/**
 * TODO: Bad API this mock shouldn't be nessesery
 */
function TaskProcessMock(def) {
	this.fn = def.fn;
}

TaskProcessMock.prototype.exec = function() {
	this.fn();
}

module.exports = TaskProcessMock;
