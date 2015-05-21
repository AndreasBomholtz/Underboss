var bot = function botMainFunc() {
    //Variables
    this.queue = [];
    this.slow_queue = [];
    this.lastCommand = {};
    this.html = {};
    this.enableTrace = false;

    this.autoFunctions = {
        "Collect": {},
        "Build": {},
        "Research": {},
        "Attack": {},
        "Bailout": {},
        "Train": {},
        "Defense": {},
        "Prize": {},
        "LoyaltyToken": {},
        "Cityscape": {},
        "Exchange": {},
        "Items": {},
        "Report": {},
        "Bonds": {}
    };

    //Functions
    this.bind = function bind(method) {
        if(method) {
            var self = this;
            return(function(){return(method.apply(self, arguments));});
        }
    };
    this.signal = function signal(sig) {
        $(document).trigger(sig);
    };
    this.listen = function listen(sig,meth) {
        $(document).bind(sig,this.bind(meth));
    };
    this.generateChangeEnable = function generateChangeEnable(name) {
        this["changeEnable"+name] = function() {
            this.options["enable"+name] = this.html["enable_"+name].checked;
            this.saveOptions();
            this.debug("Enable "+name+": " + this.options["enable"+name]);
        };
    };
    this.generateAutoThread = function generateAutoThread(name) {
        this['auto'+name+'Thread'] = function() {
            var m = this.bind(this['auto'+name+'Thread']);
            var t = 60000;
            if(this.cities && this.options['enable'+name]) {
                var res = this['do'+name]();
                if(res) {t = res;}
            }
            setTimeout(m,t);
        };
        this['auto'+name+'Thread']();
    };
    this.generateDebugEnable = function generateDebugEnable(name) {
        this["changeDebugEnable"+name] = function() {
            this["enableDebug"+name] = this.html["enable_debug_"+name].checked;
            this.debug("Enable Debug "+name+": " + this["enableDebug"+name]);
        };
    };
    this.getCity = function getCity(id) {
        if(this.cities) {
            for(var i=0; i<this.cities.length; i++) {
                if(this.cities[i].id == id) {
                    return this.cities[i];
                }
            }
        }
        return undefined;
    };
    this.findBuildingLevel = function findBuildingLevel(name,city) {
        var maxLevel = 0;
        if(city && city.neighborhood && city.neighborhood.length) {
            for(var i=0; i<city.neighborhood.length; i++) {
                var neighborhood = city.neighborhood[i];
                if(neighborhood && neighborhood.buildings) {
                    var buildings = neighborhood.buildings;
                    for(var b=0; b<buildings.length; b++) {
                        if(buildings[b].type == name) {
                            if(maxLevel < buildings[b].level) {
                                maxLevel = buildings[b].level;
                            }
                        }
                    }
                }
            }
        }
        return maxLevel;
    };

    this.countBuilding = function countBuilding(neighborhood,name) {
        this.trace();
        var count = 0;
        if(neighborhood && neighborhood.buildings) {
            var buildings = neighborhood.buildings;
            for(var b=0; b<buildings.length; b++) {
                if(buildings[b].location == "neighborhood") {
                    if(name === undefined && !buildings[b].hasOwnProperty('unlocked') && buildings[b].type != "Exchange") {
                        count++;
                    } else if(buildings[b].type == name) {
                        count++;
                    }
                }
            }
        }
        return count;
    };

    this.findBuildingSlot = function findBuildingSlot(neighborhood) {
        this.trace();
        var slots = [],i=0;
        for(i=0; i<45; i++) {
            slots[i] = true;
        }
        if(neighborhood && neighborhood.buildings) {
            var buildings = neighborhood.buildings;
            for(var b=0; b<buildings.length; b++) {
                if(buildings[b].hasOwnProperty('slot') && buildings[b].location == "neighborhood") {
                    slots[buildings[b].slot] = false;
                }
            }
        }
        for(i=0; i<slots.length; i++) {
            if(slots[i]) {
                return i;
            }
        }
        return 0;
    };

    this.addStat = function addStat(name,count) {
        if(!this.options.stats) {
            this.options.stats = {};
        }
        if(!this.options.stats[name]) {
            this.options.stats[name] = 0;
        }
        this.options.stats[name] += count;
        this.saveOptions();
        this.updateStats();
    };
    //------------- PARSE FUNCTIONS ----------
    this.parseData = function parseData(data) {
        var i, city, n;
        if(data) {
            if(typeof(data) == "string") {
                data = JSON.parse(data);
            }
            if(data.timestamp) {
                var d = new Date();
                var t = d.getTime() / 1000;
                this.time_diff = t-data.timestamp;
            }
            if(data.cities && data.cities[0] && data.cities[0].id) {
                if(!this.cities) {
                    this.cities = data.cities;
                    this.signal('cities:update');
                }
            }
            if(data.neighborhoods) {
                for(n in data.neighborhoods) {
                    var neighborhood = data.neighborhoods[n];
                    if(neighborhood && neighborhood.buildings && neighborhood.buildings.length) {
                        var buildings = neighborhood.buildings;
                        if(buildings[0] && buildings[0].city_id) {
                            city = this.getCity(data.neighborhoods.neighborhood.buildings[0].city_id);
                            if(city) {
                                if(!city.neighborhood) {
                                    city.neighborhood = [];
                                }
                                neighborhood.city = city;
                                var add = true;
                                for(i=0; i<city.neighborhood.length; i++) {
                                    if(city.neighborhood[i].id == neighborhood.id) {
                                        add = false;
                                        break;
                                    }
                                }
                                if(add) {
                                    city.neighborhood.push(neighborhood);
                                }
                            }
                        }
                    }
                }
            }
            if(data.city) {
                city = this.getCity(data.city.id);
                if(city) {
                    if(city.data && city.data.jobs && data.city.jobs) {
                        for(i=0; i<city.data.jobs.length; i++) {
                            var present = false;
                            for(n=0; n<data.city.jobs.length; n++) {
                                if(city.data.jobs[i].queue == data.city.jobs[n].queue) {
                                    //this.debug(city.data.jobs[i].queue+" is still present");
                                    present = true;
                                    break;
                                }
                            }
                            if(!present && city.data.jobs[i].queue) {
                                this.handleQueueComplete(city.data.jobs[i].queue);
                            }
                        }
                    }
                    city.data = data.city;
                    this.signal("jobs:update");
                    if(data.city.figures && data.city.figures.marches) {
                        city.maximum_troops = data.city.figures.marches.maximum_troops;
                    }
                }
            }
            if(data.terrain) {
                if(!this.options.map) {
                    this.options.map = {};
                }
                for(var key1 in data.terrain) {
                    var d2 = data.terrain[key1];
                    for(var key2 in d2) {
                        var val = d2[key2];
                        if(val[0] == "Gang" || val[0] == "BossGang") {
                            if(!(this.options.map[val[2]])) {
                                this.options.map[val[2]] = {};
                            }
                            if(!(this.options.map[val[2]][val[3]])) {
                                this.options.map[val[2]][val[3]] = {};
                            }

                            this.options.map[val[2]][val[3]].lvl = val[0] == "Gang" ? val[1] : parseInt(val[1],10) + 10;
                            this.options.map[val[2]][val[3]].x = val[2];
                            this.options.map[val[2]][val[3]].y = val[3];
                        }
                    }
                }
            }
            if(data.has_free_ticket) {
                this.free_ticket = data.has_free_ticket;
            }
            if(data.items) {
                this.items = data.items;
            }
            if(data.level) {
                this.player_level = data.level;
            }
            if(data.result) {
                if(data.result.prize_list) {
                    this.prizeList = data.result.prize_list;
                    this.minigame_timestamp = data.result.minigame_timestamp;
                } else if(data.result.item_won) {
                    for(var item in data.result.item_won) {
                        if(this.cities) {
                            this.updatePrizeInfo("Won: " +item,this.cities[0]);
                        } else {
                            this.updatePrizeInfo("Won: " +item);
                        }
                    }
                }
                if(data.result.prize) {
                    city = this.getCity(data.result.city_id);
                    if(data.result.prize.prize_type) {
                        this.updatePrizeInfo("Won: "+data.result.prize.prize_type,city);
                    } else {
                        for(var prize in data.result.prize) {
                            if(prize != "cash_multiplier") {
                                this.updatePrizeInfo("Won: "+prize+" "+data.result.prize[prize],city);
                            }
                        }
                    }
                }
                /*if(data.result.city && data.result.city_id) {
                  var city = this.getCity(data.result.city_id);
                  if(city) {
                  city.data = data.result.city;
                  }
                  }*/
                if(data.result.job) {
                    city = this.getCity(data.result.job.city_id);
                    if(city && city.data) {
                        if(!city.data.jobs) {
                            city.data.jobs = [];
                        }
                        city.data.jobs.push(data.result.job);
                        this.signal("jobs:update");
                    }
                }
                if(this.lastCommand.city) {
                    if(data.result.units) {
                        this.lastCommand.city.bailout = data.result.units;
                        this.payBailout(this.lastCommand.city);
                    }
                }
                if(data.result.tokens) {
                    this.tokens = data.result.tokens;
                }
                if(data.result.report_notifications) {
                    this.debugReport("Update reports");
                    this.reports = {};
                    this.reports.total = data.result.total;
                    this.reports.reports = data.result.report_notifications;
                    this.signal("report:update");
                }
                if(data.result.bonds_list) {
                    for(i=0; i<data.result.bonds_list.length; i++) {
                        var bond = data.result.bonds_list[i];
                        if(bond.name == "BearerBond" && bond.quantity == 100) {
                            this.handleBonds();
                        }
                    }
                }
            }
            if(data.energy && this.lastCommand.city) {
                this.lastCommand.city.energy = data.energy;
            }
        }
    };
    this.errorCommand = function errorCommand(data) {
        if(typeof(data) == "string") {
            data = JSON.parse(data);
        }
        this.debug("Error sending command");
        this.debug(this.lastCommand);

        if(this.lastCommand.callback !== undefined) {
            this.lastCommand.callback();
        }
    };
    this.revCommand = function revCommand(data) {
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
    };
    this.checkCityQueue = function checkCityQueue(city,queue,building) {
        this.trace();
        var queueReady = false;
        if(city && city.data && city.data.jobs) {
            queueReady = true;
            for(var n=0; n<city.data.jobs.length; n++) {
                if(building === undefined) {
                    if(city.data.jobs[n].queue && city.data.jobs[n].queue == queue) {
                        queueReady = false;
                        break;
                    }
                } else {
                    if(city.data.jobs[n].city_building_id &&
                       city.data.jobs[n].city_building_id == building)
                    {
                        queueReady = false;
                        break;
                    }
                }
            }
            if(queueReady) {
                var d = new Date();
                var t = d.getTime();
                var obj = {'run_at': t};
                if(building === undefined) {
                    obj.queue = queue;
                } else {
                    obj.city_building_id = building;
                }
                city.data.jobs.push(obj);
            }
        }
        return queueReady;
    };
    //------- LOAD DATA FUNCTIONS -----
    this.loadCityData = function loadCityData(city) {
        this.trace();
        if(city && city.id) {
            var name = "unknown";
            if(city.data && city.data.type) {
                name = city.data.type;
            }
            if(city.type) {
                name = city.type;
            }
            this.sendGetCommand("Load city "+name,"cities/"+city.id+".json","",city);
            this.sendGetCommand("Load city "+name+" neighborhood","cities/"+city.id+"/neighborhood_buildings.json","",city);
            var d = new Date();
            city.lastUpdate = d.getTime();
        }
    };
    this.loadCitiesData = function loadCitiesData() {
        this.trace();
        if(this.cities) {
            for(var i=0; i<this.cities.length; i++) {
                this.loadCityData(this.cities[i]);
            }
        }
    };
    this.autoLoadCities = function autoLoadCities() {
        this.trace();
        if(this.cities) {
            for(var i=0; i<this.cities.length; i++) {
                var d = new Date();
                if(!this.cities[i].lastUpdate || this.cities[i].lastUpdate < (d.getTime() + (60 * 5))) {
                    this.loadCityData(this.cities[i]);
                }
            }
        }

    };
    this.loadGameLoadedData = function loadGameLoadedData() {
        this.trace();
        if(this.cities && this.cities[0] && this.cities[0].id) {
            for(var i=0; i<this.cities.length; i++) {
                this.sendCommand("Load Game Data","player/game_loaded.json","_method=put",this.cities[i]);
            }
            this.loadCitiesData();
        }
    };
    this.loadPlayerData = function loadPlayerData() {
        this.trace();
        this.sendGetCommand("Load Player","player.json");
    };
    this.loadPlayerDataInit = function loadPlayerDataInit() {
        this.trace();
        var cb = this.bind(this.loadGameLoadedData);
        this.sendGetCommand("Load Player Init","player.json","",undefined,cb);
    };
    this.enqueCommand = function enqueCommand(name,url,data,type,city,callback,slow) {
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
    };
    this.addToQueue = function addToQueue(queue,cmd) {
        for(var i=0; i<queue.length; i++) {
            if(queue[i].url == cmd.url &&
               queue[i].data == cmd.data) {
                this.debug("Dropping double command: "+cmd.name,cmd.city);
                return;
            }
        }

        queue.push(cmd);
        this.signal("queue:update");
    };
    this.sendCommand = function sendCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'POST',city,callback,false);
    };
    this.sendGetCommand = function sendGetCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'GET',city,callback,false);
    };
    this.sendSlowCommand = function sendCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'POST',city,callback,true);
    };
    this.sendSlowGetCommand = function sendGetCommand(name,url,data,city,callback) {
        this.enqueCommand(name,url,data,'GET',city,callback,true);
    };
    this.sendQueue = function sendQueue() {
        if(this.queue.length > 0) {
            this.executeCommand(this.queue.shift());
        } else if(this.slow_queue.length > 0) {
            this.executeCommand(this.slow_queue.shift());
        }
    };
    this.executeCommand = function executeCommand(cmd) {
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
    };
    //------- END SEND FUNCTIONS ------

    //------- OPTIONS FUNCTIONS -------
    this.saveOptions = function saveOptions() {
        localStorage.setItem("gfb_options",JSON.stringify(this.options));
    };
    this.loadOptions = function loadOptions() {
        var value = localStorage.getItem("gfb_options");
        if(value) {
            this.options = JSON.parse(value);
        } else {
            this.options = {};
        }
    };
    //------- END OPTIONS FUNCTIONS ----

    //------- GUI FUNCTIONS ------
    //---- GUI Heper Functions -----
    this.trace = function trace() {
        if(this.enableTrace) {
            this.debug(arguments.callee.caller.name);
        }
    };
    this.debug = function debug(str,city,info) {
        var d = new Date();
        if(typeof(str) == "object") {
            console.debug(str);
            str = "";
        }
        if(city && city.data) {
            str = city.data.type+": "+str;
        }
        if(info) {
            str = info+": "+str;
        }
        str = d.toLocaleTimeString() + ": " + str;
        console.debug(str);
        return str;
    };
    this.generateDebugFunction = function(name) {
        this["enableDebug"+name] = false;
        this["debug"+name] = function(str,city) {
            if(this["enableDebug"+name]) {
                this.debug(str,city,name);
            }
        };
    };
    //------- END GUI FUNCTONS -----

    this.handleQueueComplete = function handleQueueComplete(queue) {
        this.trace();
        if(queue == "building" && this.options.enableBuild) {
            this.loadCitiesData();
        } else if(queue == "research" && this.options.enableResearch) {
            this.doResearch();
        } else if(queue == "units" && this.options.enableTrain) {
            this.doTrain();
        } else if(queue == "defense_units" && this.options.enableDefense) {
            this.doDefense();
        } else if(queue.indexOf("collect") != -1 && this.options.enableCollect) {
            this.doCollect();
        }
    };
    this.updateJobs = function updatejobs() {
        var m = this.bind(this.main);
        var timeout = 1000;

        if(this.cities) {
            var d = new Date();
            var t = d.getTime() / 1000;

            for(var i=0; i<this.cities.length; i++) {
                var city = this.cities[i];
                if(city && city.data && city.data.jobs) {
                    for(var j=0; j<city.data.jobs.length; j++) {
                        var job = city.data.jobs[j];
                        var comp = job.run_at + this.time_diff;

                        if(t >= comp) {
                            //this.debug("Job "+job.queue+" is complete",city);
                            this.loadCityData(city);
                            city.data.jobs.splice(j,1);
                            timeout = 10000;
                            this.handleQueueComplete(job.queue);
                            break;
                            //} else {
                            //this.debug("Job "+job.queue+": "+t+" < "+comp + " Diff: "+(comp-t),city);
                        }
                    }
                }
            }
        }

        setTimeout(m,timeout);
    };

    this.init = function init(data) {
        this.loadOptions();

        //Save options
        this.server = data.apiServer+"/";
        this.server = this.server.replace("http","https");
        this.player = data.playerId;
        this.session = data.sessionId;
        this.user = data.userId;
        this.gangster = data.gangster;

        //Generate functions
        for(var fun in this.autoFunctions) {
            this.generateChangeEnable(fun);
            this.generateAutoThread(fun);
            this.generateDebugEnable(fun);
            this.generateDebugFunction(fun);
        }

        //Load data
        this.loadPlayerDataInit();

        //Draw GUI
        this.drawPanel();

        //Start polling events
        var q = this.bind(this.sendQueue);
        setInterval(q,800);

        var r = this.bind(this.autoLoadCities);
        setInterval(r,60000);

        //Start main thread
        this.updateJobs();

        this.showMissingPrizeInfo();
    };

	this.extendOwn = function(obj) {
		var length = arguments.length;
		if (length < 2 || obj == null) return obj;
		for (var index = 1; index < length; index++) {
			console.log(index);
			var source = arguments[index];
			console.log(source);
			console.log(Object.keys);
			var keys = Object.keys(source);
			console.log(keys);
			var l = keys.length;
			for (var i = 0; i < l; i++) {
				var key = keys[i];
				console.log("Adding "+key);
				obj[key] = source[key];
			}
		}
		return obj;
	};

    this.botStartIfCIsAvailable = function() {
        if (typeof C != 'undefined') {
            this.init(C.attr);
        } else {
            window.setTimeout(this.bind(this.botStartIfCIsAvailable,bind), 1000);
        }
    }

	// Combine bot
	this.extendOwn(this,
				collectBot,
				buildBot,
				researchBot,
				attackBot,
				bailoutBot,
				bondsBot,
				guiBot,
				itemBot,
				prizeBot,
				reportBot,
				trainBot);

	console.log(this.toString());

    window.setTimeout(this.bind(this.botStartIfCIsAvailable,this), 1000);
};
