var bot = {
    //Variables
    autoFunctions: {
        Collect: {},
        Build: {},
        Research: {},
        Attack: {},
        Bailout: {},
        Train: {},
        Defense: {},
        Prize: {},
        LoyaltyToken: {},
        Cityscape: {},
        Exchange: {},
        Items: {
            event: "player:items"
        },
        Report: {},
        Bonds: {},
        Quests: {},
        Armor: {
            event: "city:armor:update"
        }
    },

    //Functions
    generateChangeEnable: function generateChangeEnable(name) {
        this["changeEnable"+name] = function changeEnable() {
            this.options["enable" + name] = this.html["enable_" + name].checked;
            this.saveOptions();
            this.debug("Enable " + name + ": " + this.options["enable" + name]);
        };
    },
    generateAutoThread: function generateAutoThread(name, opt) {
        // Default option is set to true
        if(this.options["enable"+name] === undefined) {
            this.options["enable"+name] = true;
            this.saveOptions();
        }

        if(opt.event) {
            if(this['do' + name + 'Event'] === undefined) {
                this.debug("Missing function: do" + name + "Event");
                return;
            }
            this.listen(opt.event, function listenEvent(event, param) {
                if(this.cities && this.options['enable' + name]) {
                    this['do' + name + 'Event'](param, event);
                }
            });
        } else {
            if(this['do'+name] === undefined) {
                this.debug("Missing function: do" + name);
                return;
            }
            this['auto' + name + 'Thread'] = function autoThread(bot) {
                bot.trace_r('auto' + name + 'Thread');
                var t = 60000;
                if(bot.cities && bot.options['enable' + name]) {
                    if(bot.enablePause) {
                        bot.debug("Do not " + name + " because we are on pause");
                        t = 10000;
                    } else {
                        var res = bot['do' + name]();
                        if(res) {
                            t = res;
                        }
                    }
                }
                setTimeout(bot['auto' + name + 'Thread'], t, bot);
            };
            this['auto'+name+'Thread'](this);
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

        this.signal("stats:update");
    },
    checkCityQueue: function checkCityQueue(city, queue, building) {
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
            var obj = {run_at: t};
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
        this.sendDataGetCommand("Load city "+name, "cities/" + city.id + ".json", "", city);
        this.sendDataGetCommand("Load city " + name + " neighborhood", "cities/"+city.id+"/neighborhood_buildings.json", "", city);
        var d = new Date();
        city.lastUpdate = d.getTime();
    },
    loadCitiesData: function loadCitiesData() {
        this.trace();
        this.eachCity(function loadCitiesDataEach(city) {
            this.loadCityData(city);
        });
    },
    autoLoadCities: function autoLoadCities(bot) {
        bot.trace();

        if(bot.enablePause) {
            bot.debug("Do not load cities, because we are on pause");
            return;
        }

        bot.eachCity(function autoLoadCitiesEach(city) {
            var d = new Date();
            if(!city.lastUpdate || city.lastUpdate < (d.getTime() + (60 * 5))) {
                bot.loadCityData(city);
            }
        });
    },
    loadGameLoadedData: function loadGameLoadedData(bot) {
        bot.trace();
        bot.eachCity(function loadGameLoadedDataEach(city) {
            bot.sendDataCommand("Load Game Data for " + city.name,
                                 "player/game_loaded.json",
                                 "_method=put",
                                 city);
        });

        bot.loadCitiesData();
    },
    loadPlayerData: function loadPlayerData() {
        this.trace();
        this.sendDataGetCommand("Load Player", "player.json");
    },
    loadPlayerDataInit: function loadPlayerDataInit() {
        this.trace();
        this.sendDataGetCommand("Load Player Init", "player.json", "", undefined, this.loadGameLoadedData);
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
    updateJobs: function updatejobs(bot) {
        var timeout = 1000;

        if(bot.cities) {
            var d = new Date();
            var t = d.getTime() / 1000;

            for(var i=0; i<bot.cities.length; i++) {
                var city = bot.cities[i];
                if(city && city.jobs) {
                    for(var j=0; j<city.jobs.length; j++) {
                        var job = city.jobs[j];
                        var comp = job.run_at + bot.time_diff;

                        if(t >= comp) {
                            bot.loadCityData(city);
                            city.jobs.splice(j, 1);
                            timeout = 10000;
                            bot.handleQueueComplete(job.queue);
                            break;
                        }
                    }
                }
            }
        }
        setTimeout(bot.updateJobs, timeout, bot);
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
        this.enablePause = false;

        this.debug(data);

        //Save options
        this.server   = data.apiServer.replace("http","https") + "/";
        this.player   = data.playerId;
        this.session  = data.sessionId;
        this.user     = data.userId;
        this.gangster = data.gangster;

        //Generate functions
        for(var fun in this.autoFunctions) {
            this.generateAutoThread(fun, this.autoFunctions[fun]);

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
        if(this.options.queue_interval === undefined) {
            this.options.queue_interval = 800;
            this.saveOptions();
        }
        setInterval(this.sendQueue, this.options.queue_interval, this);
        setInterval(this.autoLoadCities, 60000, this);

        //Start main thread
        this.updateJobs(this);

        this.showMissingPrizeInfo();
    },

    start: function start(bot) {
        if(!bot) {
            bot = this;
        }
        if (typeof C != 'undefined') {
            bot.init(C.attrs);
        } else {
            window.setTimeout(bot.start, 1000, bot);
        }
    }
};
module.exports = bot;
