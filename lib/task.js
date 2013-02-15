var fs = require('fs'),
    util = require('./util'),
    spawn = require('win-spawn');

function Task(config) {
	var dirname = 'yui3-' + (config.ref === "HEAD" ? "HEAD-" + new Date().getTime() : config.ref);
	this.id = config.id;
	this.ref = config.ref;
	this.dir = config.tmpRoot + dirname + "/";
	this.testUrl = 'http://127.0.0.1:3000/task/' + this.id;
	this.seedBase = 'http://127.0.0.1:3000/yui3/' + this.id;
	this.ready = false;
	this.results = null;
}

Task.prototype.log = function (msg) {
	console.log("[Task " + this.ref + "]: " + msg);
}

Task.prototype.init = function (callback) {
	var self = this,
		yuiBenchPath = util.yuiBenchPath,
		yuiPath = global.yuiPath,
		script = yuiBenchPath + 'scripts/git-thing.sh',
		args = ['file://' + yuiPath, self.ref],
		child;

	if (!fs.existsSync(self.dir)) {
		fs.mkdirSync(self.dir);
	    self.log("Made dir " + self.dir);
	}

	if (!fs.existsSync(self.dir + "/build/yui/yui-min.js")) {
		self.log("Fetching yui3@" + self.ref);
	    child = spawn(script, args, {cwd: self.dir});
	    child.stdout.setEncoding('utf8');
	    console.log(script, args);
	    // child.stdout.on('data', function(data) { self.log(data); });
	    child.on('exit', function (error, stdout, stderr) {
	    	self.ready = true;
	        self.log("Done. Ready!");
	        callback();
	    });	
	}
	else {
        self.log("Seed found. Ready!");
		callback();
	}
};

exports.Task = Task;