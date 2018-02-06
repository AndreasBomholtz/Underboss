var queueBot = {
    enqueCommand: function enqueCommand(name, url, data, type, city, callback, queue_type, neighborhood, custom) {
        this.trace();

        if(city !== undefined) {
            if(data !== "") {
                data = "city_id=" + city.id + "&" + data;
            } else {
                data = "city_id=" + city.id;
            }
        }
        var cmd = {};
        cmd.name = name;
        cmd.type = type;
        cmd.url = this.server + url;
        cmd.city = city;
        cmd.neighborhood = neighborhood;
        cmd.data = "_session_id="+this.session+"&gangster="+this.gangster+"&user_id="+this.user+"&"+data;
        cmd.callback = callback;
        cmd.custom = custom;

        cmd.data = cmd.data.replace(new RegExp("_", 'g'), "%5F");

        if(queue_type === 'slow') {
            this.addToQueue(this.slow_queue, cmd);
        } else if(queue_type === 'data') {
            this.addToQueue(this.data_queue, cmd);
        } else {
            this.addToQueue(this.queue, cmd);
        }
    },
    addToQueue: function addToQueue(queue, cmd) {
        for(var i=0; i<queue.length; i++) {
            if(queue[i].url == cmd.url &&
               queue[i].data == cmd.data &&
               cmd.name.indexOf("Collect ") == -1) {
                this.debug("Dropping double command: "+cmd.name, cmd.city);
                return;
            }
        }

        queue.push(cmd);
        this.signal("queue:update");
    },
    sendCommand: function sendCommand(name, url, data, city, callback, neighborhood, custom) {
        this.enqueCommand(name, url, data, 'POST', city, callback, 'cmd', neighborhood, custom);
    },
    sendGetCommand: function sendGetCommand(name, url, data, city, callback, neighborhood, custom) {
        this.enqueCommand(name, url, data, 'GET', city, callback, 'cmd', neighborhood, custom);
    },
    sendSlowCommand: function sendCommand(name, url, data, city, callback, neighborhood, custom) {
        this.enqueCommand(name, url, data, 'POST', city, callback, 'slow', neighborhood, custom);
    },
    sendSlowGetCommand: function sendGetCommand(name, url, data, city, callback, neighborhood, custom) {
        this.enqueCommand(name, url, data, 'GET', city, callback, 'slow', neighborhood, custom);
    },
    sendDataCommand: function sendCommand(name, url, data, city, callback, neighborhood, custom) {
        this.enqueCommand(name, url, data, 'POST', city, callback, 'data', neighborhood, custom);
    },
    sendDataGetCommand: function sendGetCommand(name, url, data, city, callback, neighborhood, custom) {
        this.enqueCommand(name, url, data, 'GET', city, callback, 'data', neighborhood, custom);
    },
    sendQueue: function sendQueue() {
        var q;

        if(this.queue_type === 'data') {
            if(this.data_queue.length) {
                q = this.data_queue;
            } else if(this.queue.length) {
                q = this.queue;
                this.queue_type = 'cmd';
                this.signal('queue:change');
            }
        } else {
            if(this.queue.length) {
                q = this.queue;
            } else if(this.data_queue.length) {
                q = this.data_queue;
                this.queue_type = 'data';
                this.signal('queue:change');
            }
        }
        if(q === undefined && this.slow_queue.length) {
            q = this.slow_queue;
        }

        //Send cmd
        if(this.lastCommand) {
            this.debug("Resending last command: "+this.lastCommand.name, this.lastCommand.city);
            this.debug(this.lastCommand);
            this.executeCommand(this.lastCommand);
        } else if(q) {
            this.executeCommand(q.shift());
        }
    },
    executeCommand: function executeCommand(cmd) {
        if(cmd === undefined) {
            return;
        }
        if(cmd.resends >= 2) {
            this.debug("Last command has been send 3 times: "+this.lastCommand.name,
                       this.lastCommand.city);
            this.lastCommand = undefined;
            return;
        }
        cmd.resends = (cmd.resends + 1) || 1;
        this.lastCommand = cmd;
        this.signal("queue:update");
        var self = this;

        $.ajax({
            type: this.lastCommand.type,
            url: this.lastCommand.url,
            data: this.lastCommand.data,
            success: function(data) {
                self.revCommand(data);
            },
            error: function(data) {
                self.errorCommand(data);
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-Requested-With", "ShockwaveFlash/28.0.0.126");
            }
        });
    },
    errorCommand: function errorCommand(data, status, error) {
        if(typeof(data) == "string") {
            try {
                data = JSON.parse(data);
            } catch(err) {
                this.debug("Recevied invalid JSON in error handler: "+this.lastCommand.name,
                           this.lastCommand.city);
                this.debug(err);
                return;
            }
        }
        this.debug("Error sending command: "+data.responseText);
        this.debug(this.lastCommand);


        if(this.lastCommand && this.lastCommand.callback !== undefined) {
            this.lastCommand.callback();
        }
    },
    revCommand: function revCommand(data) {
        if(typeof(data) == "string") {
            try {
                data = JSON.parse(data);
            } catch(err) {
                this.debug("Received invalid JSON for command: "+this.lastCommand.name);
                this.debug(err);
                this.lastCommand = undefined;
                return;
            }
        }
        if(data && data.result) {
            if(!data.result.success) {
                this.debug("Command send Error: "+data.result.errors[0]);
                this.debug(this.lastCommand);

                if(data.result.errors[0] === "Slot is reserved") {
                    this.debug("Slot is reserved");
                    if(this.lastCommand.neighborhood && this.lastCommand.custom && this.lastCommand.custom.slot) {
                        this.debug("Setting slot");
                        var n_id = this.lastCommand.neighborhood.id;
                        var slot = this.lastCommand.custom.slot;
                        if(!this.options.reserved_slots) {
                            this.options.reserved_slots = {};
                        }
                        if(!this.options.reserved_slots[n_id]) {
                            this.options.reserved_slots[n_id] = {};
                        }
                        this.debug(this.options.reserved_slots);
                        this.options.reserved_slots[n_id][slot] = 'reserved';
                        this.debug(this.options.reserved_slots);

                        this.saveOptions();
                    } else {
                        this.debug("Missing neighborhood or custom slot to handle error");
                    }
                }

                /*if(this.lastCommand.city) {
                 this.loadCityData(this.lastCommand.city);
                 } else {
                 this.loadPlayerData();
                 }*/
            }
        }
        this.parseData(data);

        if(this.lastCommand) {
            if(this.lastCommand.callback !== undefined) {
                this.lastCommand.callback();
            }

            this.lastCommand = undefined;
        }
    }
};
