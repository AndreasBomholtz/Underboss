var queueBot = {
    enqueCommand: function enqueCommand(name,url,data,type,city,callback,slow) {
        this.trace();

        if(city !== undefined) {
            if(data !== "") {
                data += "&";
            }
            data += "city_id="+city.id;
        }
        var cmd = {};
        cmd.name = name;
        cmd.type = type;
        cmd.url = this.server + url;
        cmd.city = city;
        cmd.data = data+"&_session_id="+this.session+"&gangster="+this.gangster+"&user_id="+this.user;
        cmd.callback = callback;

        if(slow === true) {
            this.addToQueue(this.slow_queue,cmd);
        } else {
            this.addToQueue(this.queue,cmd);
        }
    },
    addToQueue: function addToQueue(queue,cmd) {
        for(var i=0; i<queue.length; i++) {
            if(queue[i].url == cmd.url &&
               queue[i].data == cmd.data &&
			   cmd.name.indexOf("Collect ") == -1) {
                this.debug("Dropping double command: "+cmd.name,cmd.city);
                return;
            }
        }

        queue.push(cmd);
        this.signal("queue:update");
    },
    sendCommand: function sendCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'POST',city,callback,false);
    },
    sendGetCommand: function sendGetCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'GET',city,callback,false);
    },
    sendSlowCommand: function sendCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'POST',city,callback,true);
    },
    sendSlowGetCommand: function sendGetCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'GET',city,callback,true);
    },
    sendQueue: function sendQueue() {
        if(this.queue.length > 0) {
            this.executeCommand(this.queue.shift());
        } else if(this.slow_queue.length > 0) {
            this.executeCommand(this.slow_queue.shift());
        }
    },
    executeCommand: function executeCommand(cmd) {
        this.lastCommand = cmd;
        this.signal("queue:update");
        var self = this;
        $.ajax({
            type: this.lastCommand.type,
            url: this.lastCommand.url,
            data: this.lastCommand.data,
            success: function(data) {self.revCommand(data);},
            error: function(data) {self.errorCommand(data);}
        });
    },
    errorCommand: function errorCommand(data) {
        if(typeof(data) == "string") {
            data = JSON.parse(data);
        }
        this.debug("Error sending command: "+data.responseText);
        this.debug(this.lastCommand);

        if(this.lastCommand.callback !== undefined) {
            this.lastCommand.callback();
        }
    },
    revCommand: function revCommand(data) {
        if(typeof(data) == "string") {
            data = JSON.parse(data);
        }
        if(data && data.result) {
            if(!data.result.success) {
                this.debug("Command send Error: "+data.result.errors[0]);
                this.debug(this.lastCommand);
                if(this.lastCommand.city) {
                    this.loadCityData(this.lastCommand.city);
                } else {
                    this.loadPlayerData();
                }
            }
        }
        this.parseData(data);

        if(this.lastCommand.callback !== undefined) {
            this.lastCommand.callback();
        }
    }
};
