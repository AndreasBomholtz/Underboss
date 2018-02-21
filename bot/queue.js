var queueBot = {
    Command: function Command() {},
    enqueCommand: function enqueCommand(name, url, data, type, city, callback, queue_type, neighborhood, custom) {
        this.trace();

        if(city !== undefined) {
            if(data !== "") {
                data = "city_id=" + city.id + "&" + data;
            } else {
                data = "city_id=" + city.id;
            }
        }

        var cmd = new this.Command();
        cmd.name = name;
        cmd.type = type;
        cmd.url = this.server + url;
        cmd.city = city;
        cmd.neighborhood = neighborhood;
        cmd.data = "_session_id="+this.session+"&gangster="+this.gangster+"&user_id="+this.user+"&"+data;
        cmd.callback = callback;
        cmd.custom = custom;

        if(queue_type === 'slow') {
            this.addToQueue(this.slow_queue, cmd);
        } else if(queue_type === 'data') {
            this.addToQueue(this.data_queue, cmd);
        } else {
            if(this.enableHTTP) {
                cmd.url = cmd.url.replace("https","http");
            }
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
    sendQueue: function sendQueue(bot) {
        if(bot.queue_busy) {
            return;
        }

        //Send cmd
        if(bot.lastCommand) {
            bot.debug("Resending last command: " + bot.lastCommand.name, bot.lastCommand.city);
            bot.debug(bot.lastCommand);
            bot.executeCommand(bot.lastCommand);
            return;
        }

        if(bot.queue_type === 'data') {
            if(bot.data_queue.length) {
                bot.executeCommand(bot.data_queue.shift());
            } else if(bot.queue.length) {
                bot.executeCommand(bot.queue.shift());
                bot.queue_type = 'cmd';
                bot.signal('queue:change');
            } else if(bot.slow_queue.length) {
                bot.executeCommand(bot.slow_queue.shift());
            }
        } else {
            if(bot.queue.length) {
                bot.executeCommand(bot.queue.shift());
            } else if(bot.data_queue.length) {
                bot.executeCommand(bot.data_queue.shift());
                bot.queue_type = 'data';
                bot.signal('queue:change');
            } else if(bot.slow_queue.length) {
                bot.executeCommand(bot.slow_queue.shift());
            }
        }
    },
    executeCommand: function executeCommand(cmd) {
        if(cmd === undefined) {
            return;
        }
        if(cmd.resends > 2) {
            this.debug("Last command has been send 3 times: " + this.lastCommand.name,
                       this.lastCommand.city);
            this.lastCommand = undefined;
            return;
        }

        this.debug(cmd.name);
        if(typeof($) !== 'undefined') {
            this.ajax_send(cmd.url, this.revCommand, this.errorCommand, cmd.type, cmd.data, true);
        } else {
            if(!this.request) {
                this.request = require('request');
            }

            var options = {
                method: cmd.type,
                url: cmd.url,
                body: cmd.data,
                headers: {
                    Origin: 'https://c1.godfather.rykaiju.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Cache-Control': 'max-age=0',
                    Referer: 'https://c1.godfather.rykaiju.com/platforms/facebook/',
                    Connection: 'keep-alive',
                    'X-Requested-With': 'ShockwaveFlash/28.0.0.126'
                }
            };
            var bot = this;
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    bot.revCommand(body);
                } else {
                    bot.errorCommand(body);
                }
            }
            this.request(options, callback);
        }


        this.queue_busy = true;
        cmd.resends = (cmd.resends + 1) || 1;
        this.lastCommand = cmd;
        this.signal("queue:update");

    },
    errorCommand: function errorCommand(status, data) {
        this.queue_busy = false;

        var response = "";
        if(status != 404) {
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
            response = data.responseText;
        } else {
            response = data;
        }
        this.debug("Error sending command: " + response);
        this.debug(this.lastCommand);

        if(this.lastCommand && this.lastCommand.callback !== undefined) {
            this.lastCommand.callback(this);
        }
    },
    revCommand: function revCommand(data) {
        this.queue_busy = false;
        if(typeof(data) == "string") {
            try {
                data = JSON.parse(data);
            } catch(err) {
                this.debug("Received invalid JSON for command: " + this.lastCommand.name);
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
            }
        }
        this.parseData(data);

        if(this.lastCommand) {
            if(this.lastCommand.callback !== undefined) {
                this.lastCommand.callback(this);
            }

            this.lastCommand = undefined;
        }
    }
};
module.exports = queueBot;
