var debugBot = {
    trace: function trace() {
        if(this.enableTrace) {
            this.debug(arguments.callee.caller.name);
        }
    },
	setDebugCity: function setDebugCity(city) {
		this.debugCity = city;
	},
    debug: function debug(str,city,info) {
	if(city && this.debugCity && this.debugCity != "All" && this.debugCity != city.type) {
	    return "";
	}
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
    },
    toggleTrace: function() {
        this.enableTrace = !this.enableTrace;
		console.info("Trace is now "+this.enableTrace);
    },
    executeCMD: function() {
        var cmd = window.prompt("Enter CMD","");
        try {
            var res = eval(cmd);
            if(res) {this.debug(res);}
        } catch(e) {
            alert(e);
        }
    }
};
