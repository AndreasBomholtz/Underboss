var debugBot = {
    trace: function trace() {
        if(this.enableTrace) {
            this.debug(arguments.callee.caller.name);
        }
    },
    debug: function debug(str,city,info) {
        var d = new Date();
        if(typeof(str) == "object") {
            console.debug(str);
            str = "";
        }
        if(city && city.type) {
            str = city.type+": "+str;
        }
        if(info) {
            str = info+": "+str;
        }
        str = d.toLocaleTimeString() + ": " + str;
        console.debug(str);
        return str;
    },
    generateDebugFunction: function(name) {
        this["enableDebug"+name] = false;
        this["debug"+name] = function(str,city) {
            if(this["enableDebug"+name]) {
                this.debug(str,city,name);
            }
        };
    },
	generateDebugEnable: function generateDebugEnable(name) {
        this["changeDebugEnable"+name] = function() {
            this["enableDebug"+name] = this.html["enable_debug_"+name].checked;
            this.debug("Enable Debug "+name+": " + this["enableDebug"+name]);
        };
    }
};
