var bot = {
    //Variables
    autoFunctions: {
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
        "Items": {
	    "event": "player:items"
	},
        "Report": {},
        "Bonds": {},
	"Quests": {},
	"Armor": {
	    "event": "city:armor:update"
	}
    },

    //Functions
    generateChangeEnable: function generateChangeEnable(name) {
        this["changeEnable"+name] = function() {
            this.options["enable"+name] = this.html["enable_"+name].checked;
            this.saveOptions();
            this.debug("Enable "+name+": " + this.options["enable"+name]);
        };
    },
    generateAutoThread: function generateAutoThread(name, opt) {
	if(opt.event) {
	    if(this['do'+name+'Event'] === undefined) {
		this.debug("Missing function: do"+name+"Event");
		return;
	    }
	    this.listen(opt.event,function(event, param) {
		if(this.cities && this.options['enable'+name]) {
		    this['do'+name+'Event'](param);
		}
	    });
	} else {
	    if(this['do'+name] === undefined) {
		this.debug("Missing function: do"+name);
		return;
	    }
	    this['auto'+name+'Thread'] = function() {
		var m = this.bind(this['auto'+name+'Thread']);
		var t = 60000;
		if(this.cities && this.options['enable'+name]) {
		    var res = this['do'+name]();
		    if(res) {
			t = res;
		    }
		}
		setTimeout(m,t);
	    };
	    this['auto'+name+'Thread']();
	}
    },
    getCity: function getCity(id) {
        if(!this.cities) {
            return undefined;
	}
	for(var i=0; i<this.cities.length; i++) {
            if(this.cities[i].id == id) {
                return this.cities[i];
            }
        }
        return undefined;
    },

    addStat: function addStat(name,count) {
        if(!this.options.stats) {
            this.options.stats = {};
        }
        if(!this.options.stats[name]) {
            this.options.stats[name] = 0;
        }
        this.options.stats[name] += count;
        this.saveOptions();
        this.updateStats();
    },
    checkCityQueue: function checkCityQueue(city,queue,building) {
        this.trace();
        
        if(!city || !city.jobs) {
	    return false;
	}

        var queueReady = true;
        for(var n=0; n<city.jobs.length; n++) {
            if(building === undefined) {
                if(city.jobs[n].queue && city.jobs[n].queue === queue) {
                    queueReady = false;
                    break;
                }
            } else {
                if(city.jobs[n].city_building_id &&
                   city.jobs[n].city_building_id === building)
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
            city.jobs.push(obj);
        }
   
        return queueReady;
    },
    //------- LOAD DATA FUNCTIONS -----
    loadCityData: function loadCityData(city) {
        this.trace();
        if(!city || !city.id) {
	    return;
	}

        var name = "unknown";
        if(city.type) {
            name = city.type;
        }
        this.sendDataGetCommand("Load city "+name,
				"cities/"+city.id+".json",
				"",city);
        this.sendDataGetCommand("Load city "+name+" neighborhood",
				"cities/"+city.id+"/neighborhood_buildings.json",
				"",city);
        var d = new Date();
        city.lastUpdate = d.getTime();
    },
    loadCitiesData: function loadCitiesData() {
        this.trace();
	this.eachCity(function(city) {
            this.loadCityData(city);
        });
    },
    autoLoadCities: function autoLoadCities() {
        this.trace();
	this.eachCity(function(city) {
            var d = new Date();
            if(!city.lastUpdate || city.lastUpdate < (d.getTime() + (60 * 5))) {
                this.loadCityData(city);
            }
        });
    },
    loadGameLoadedData: function loadGameLoadedData() {
        this.trace();
	this.eachCity(function(city) {
	    this.sendDataCommand("Load Game Data",
				 "player/game_loaded.json",
				 "_method=put",
				 city);
        });
    
	this.loadCitiesData();
    },
    loadPlayerData: function loadPlayerData() {
        this.trace();
        this.sendDataGetCommand("Load Player","player.json");
    },
    loadPlayerDataInit: function loadPlayerDataInit() {
        this.trace();
        var cb = this.bind(this.loadGameLoadedData);
        this.sendDataGetCommand("Load Player Init","player.json","",undefined,cb);
    },
    //------- END SEND FUNCTIONS ------


    handleQueueComplete: function handleQueueComplete(queue) {
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
    },
    updateJobs: function updatejobs() {
        var m = this.bind(this.main);
        var timeout = 1000;

        if(this.cities) {
            var d = new Date();
            var t = d.getTime() / 1000;

            for(var i=0; i<this.cities.length; i++) {
                var city = this.cities[i];
                if(city && city.jobs) {
                    for(var j=0; j<city.jobs.length; j++) {
                        var job = city.jobs[j];
                        var comp = job.run_at + this.time_diff;

                        if(t >= comp) {
                            this.loadCityData(city);
                            city.jobs.splice(j,1);
                            timeout = 10000;
                            this.handleQueueComplete(job.queue);
                            break;
                        }
                    }
                }
            }
        }

        setTimeout(m,timeout);
    },

    init: function init(data) {
        this.loadOptions();

	// Init variables
	this.queue = [];
	this.data_queue = [];
	this.slow_queue = [];
	this.queue_type = 'data';
	this.html = {};
	this.enableTrace = false;

	this.debug(data);

        //Save options
        this.server   = data.apiServer.replace("http","https")+"/";
        this.player   = data.playerId;
        this.session  = data.sessionId;
        this.user     = data.userId;
        this.gangster = data.gangster;

        //Generate functions
        for(var fun in this.autoFunctions) {
	    this.generateAutoThread(fun,this.autoFunctions[fun]);
	    
	    this.generateChangeEnable(fun);
            this.generateDebugEnable(fun);
            this.generateDebugFunction(fun);
        }

        //Load data
        this.loadPlayerDataInit();

        //Draw GUI
	if(this.initGUI) {
            this.initGUI();
	}

        //Start polling events
        var q = this.bind(this.sendQueue);
	if(this.options.queue_interval === undefined) {
	    this.options.queue_interval = 800;
	    this.saveOptions();
	}
        setInterval(q,this.options.queue_interval);

        var r = this.bind(this.autoLoadCities);
        setInterval(r,60000);

        //Start main thread
        this.updateJobs();

        this.showMissingPrizeInfo();
    },

    start: function() {
        if (typeof C != 'undefined') {
            this.init(C.attrs);
        } else {
            window.setTimeout(this.bind(this.start), 1000);
        }
    }

};
