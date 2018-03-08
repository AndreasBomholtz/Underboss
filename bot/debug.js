var debugBot = {
    trace: function trace() {
        this.trace_r(arguments.callee.caller.name);
    },
    trace_r: function trace(name) {
        if(this.enableTrace) {
            this.debug(name);
        }
    },
    setDebugCity: function setDebugCity(city) {
        this.debugCity = city;
    },
    log_format: function log_format(str, city, info, neighborhood) {
        if(city && this.debugCity && this.debugCity != "All" && this.debugCity != city.type) {
            return "";
        }
        if(typeof(str) == "object") {
            return str;
        }
        var d = new Date();
        if(city && city.type) {
            if(neighborhood && neighborhood.id) {
                str = city.type + " (" + neighborhood.id + "): " + str;
            } else {
                str = city.type+": "+str;
            }
        }
        if(info) {
            str = info+": "+str;
        }
        str = d.toLocaleTimeString() + ": " + str;

        return str;
    },
    log: function log(func, str, city, info, neighborhood) {
        var message = this.log_format(str, city, info, neighborhood);
        if(message !== "") {
            func(message);
        }
    },
    debug: function debug(str, city, info, neighborhood) {
        this.log(console.debug, str, city, info, neighborhood);
    },
    info: function info(str, city, info, neighborhood) {
        this.log(console.info, str, city, info, neighborhood);
        if(this.updateInfo) {
            this.updateInfo(str, city);
        }
    },
    generateDebugFunction: function generateDebugFunction(name) {
        this["enableDebug" + name] = false;
        this["debug" + name] = function enableDebugFunctionDebug(str, city, neighborhood) {
            if(this["enableDebug" + name]) {
                this.debug(str, city, name, neighborhood);
            }
        };
        this["info" + name] = function enableDebugFunctionInfo(str, city, neighborhood) {
            this.info(str, city, name, neighborhood);
        };
    },
    generateDebugEnable: function generateDebugEnable(name) {
        this["changeDebugEnable"+name] = function changeDebugEnable() {
            this["enableDebug"+name] = $("#enable_debug_"+name).is(':checked');
            this.debug("Enable Debug "+name+": " + this["enableDebug"+name]);
        };
    },
    toggleTrace: function toggleTrace() {
        this.enableTrace = !this.enableTrace;
        console.info("Trace is now "+this.enableTrace);
    },
    togglePause: function togglePause() {
        this.enablePause = !this.enablePause;
        console.info("Pause is now "+this.enablePause);
    },
    executeCMD: function executeCMD() {
        var cmd = window.prompt("Enter CMD","");
        try {
            var res = eval(cmd);
            if(res) {
                this.debug(res);
            }
        } catch(e) {
            alert(e);
        }
    }
};
module.exports = debugBot;
