var events = require('events');

var Test = function() {
    this.something = "hello";
}

Test.prototype = new events.EventEmitter;
module.exports = Test;

Test.prototype.init = function() {
    self = this;
    self.emit("test",true);
}