YUI.add('bench', function (Y, NAME) {

    function Bench(config) {
        var self = this;
        
        // Set a global for Yeti detection
        Y.config.win.YUIBench = this;

        this.component = config.component;
        this.name = config.name;
        this.yuiVersion = YUI.version;

        if (config.constructor) {
            if (config.constructor === Benchmark.Suite) {
                this.benchmark = new config.constructor(config);
            }
            else if (config.constructor === Benchmark) {
                this.benchmark = new config.constructor(config);
            }
            else if (config.constructor === Benchmark.Deferred) {
                this.benchmark = new config.constructor(config);
            }
        }

        if (this.benchmark) {
            this.benchmark.on('complete', function () {
                var results = this[0];
                self.setValue(results.hz, results.stats);
            });
        }
    }

    Bench.prototype.setValue = function (val, stats) {
        var self = this,
            stats = stats || {};
            
        self._sendResult({
            component: self.component,
            name: self.name,
            yuiVersion: self.yuiVersion,
            value: val,
            stats: stats
        });
    };

    Bench.prototype.go = function () {
        this.run({async:true});
    };

    Bench.prototype._sendResult = function (results) {
        // TODO: Figure out a way to not have this be delayed
        Y.later(1000, Y.config.win.YUIBench, function () {
            this.fire('result', {
                results: results
            });
        });
    };

    Y.augment(Bench, Y.EventTarget);
    
    Y.Bench = Bench;
});