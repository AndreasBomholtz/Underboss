// ==UserScript==
// @name        The Underboss
// @namespace   Underboss
// @author      MrAnderson
// @description A bot for the game The Godfather from kabam.com
// @include     https://www.kabam.com/games/the-godfather/play
// @include     https://www.kabam.com/*/games/the-godfather/play
// @include     https://*godfather.*.com/platforms/kabam/game
// @version     2.0.0
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @updateURL   https://raw.githubusercontent.com/AndreasBomholtz/Underboss/master/Underboss.js
// @downloadURL https://raw.githubusercontent.com/AndreasBomholtz/Underboss/master/Underboss.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     http://underscorejs.org/underscore-min.js
// @require     https://raw.githubusercontent.com/millermedeiros/js-signals/master/dist/signals.min.js
// @resource    underbossCSS underboss.css
// @require     frame.js
// @require     res/buildings.js
// @require     res/research.js
// @require     res/prizes.js
// @require     res/attack_units.js
// @require     res/defense_units.js
// ==/UserScript==


// Adds the CSS
var css = GM_getResourceText("underbossCSS");
GM_addStyle (css);


(function wholeBotScriptFunc() {
    var main = function botMainFunc() {
        function botStartIfCIsAvailable() {
            if (typeof C != 'undefined') {
                botScript();
            } else {
                window.setTimeout(botStartIfCIsAvailable, 1000);
            }
        }
        window.setTimeout(botStartIfCIsAvailable, 1000);

        var botScript = function() {
            var script = document.createElement("script");
            script.innerHTML = "var gfb = {};";
            script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(script);

            function GodfatherBot(data,attackUnits) {
                //Variables
                this.queue = [];
                this.slow_queue = [];
                this.lastCommand = {};
                this.html = {};
				this.enableTrace = false;
				this.attackUnits = attackUnits;

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
                //------ END LOAD DATA FUNCTIONS ----

                //----- COLLECT FUNCTIONS ----
                this.doCollect = function doCollect() {
                    this.trace();
					if(this.cities) {
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
                            if(city && city.neighborhood) {
								for(var n=0; n<city.neighborhood.length; n++) {
									var neighborhood = city.neighborhood[n];
									if(neighborhood && neighborhood.buildings) {
										var buildings = neighborhood.buildings;
										for(var b=0; b<buildings.length; b++) {
											var building = buildings[b];
											if(building.hasOwnProperty('unlocked') && building.unlocked) {
												var do_collect = this.checkCityQueue(neighborhood.city,undefined,building.id);
												if(do_collect) {
													this.debug("Collect "+building.type,city);
													var url = "cities/"+neighborhood.city.id+"/npc_buildings/"+building.id+".json";
													var parm = "_method=put&city_building_id="+building.id;
													this.sendCommand("Collect "+building.type+" in "+city.type,url,parm,neighborhood.city);
													this.addStat("Collect",1);
													return(60*1000);
												}
											}
										}
									}
								}
							}
						}
					}
					return(1000);
				};
				this.doCityscape = function doCityscape() {
				    this.trace();
				    if(this.cities) {
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
                            if(city && city.data && city.data.wildernesses && city.data.wildernesses) {
                                for(var c=0; c<city.data.wildernesses.length; c++) {
                                    var wild = city.data.wildernesses[c];
                                    if(wild) {
                                        if(wild.type == "CityScape") {
                                            var d = new Date();
                                            var t = d.getTime() / 1000;
                                            var diff = t-wild.last_collected_at;
                                            var need = 60*60*6;
                                            if(diff >= need) {
                                                this.debugCityscape("Collect cityscapes",city);
                                                this.sendCommand("Collect Cityscape in "+city.type,"cities/"+city.id+"/wildernesses/collect_all.json",'',city);
                                                this.addStat("CityScape",1);
                                                break;
                                            } else {
                                              this.debugCityscape("Diff is "+diff+" < "+need);
                                            }
                                        } else {
                                            this.debugCityscape("Wild is "+wild.type,city);
                                        }
                                    } else {
                                        this.debugCityscape("Wild is empty",city);
                                    }
                                }
                            } else {
                                this.debugCityscape("Wilderness is not ready",city);
                            }
                        }
				    } else {
				        this.debugCityscape("Cities is not ready");
				    }
				    return(60*1000*60);
				};
				this.doExchange = function doExchange() {
				  this.trace();
				  if(this.cities && this.cities[0] && this.cities[0].neighborhood && this.cities[0].neighborhood.length) {
				      var city = this.cities[0];
				      if(city && city.neighborhood && city.neighborhood.length) {
                          for(var n=0; n<this.cities[0].neighborhood.length; n++) {
                            var neighborhood = this.cities[0].neighborhood[n];
                            if(neighborhood && neighborhood.buildings) {
                                for(var b=0; b<neighborhood.buildings.length; b++) {
                                    if(neighborhood.buildings[b].type == "Exchange") {
                                        if(neighborhood.buildings[b].free_ticket) {
                                            var url = "cities/"+city.city_id+"/exchanges/"+neighborhood.buildings[b].id+"/collect.json";
                                            var data = "_method=put&_action=collect&city_building_id="+neighborhood.buildings[b].id;
                                            this.sendCommand("Collect Exchange",url,data,this.cities[0]);
                                            neighborhood.buildings[b].free_ticket = false;
                                            this.updateInfo("Collect Exchange");
                                            this.addStat("Exchange",1);
                                            return(60*60*1000);
                                        } else {
                                            this.debugExchange("No free ticket",city);
                                        }
                                    } else {
                                        this.debugExchange("No Exchange building",city);
                                    }
                                }
                            } else {
                                this.debugExchange("Buildings not ready",city);
                            }
                          }
                      } else {
                       	this.debugExchange("Neighborhod not ready",city);
                      }
				  } else {
				      this.debugExchange("Cities not ready");
				  }
				  return(0);
				};
				this.doLoyaltyToken = function doLoyaltyToken() {
                    this.trace();
                    if(this.cities && this.cities[0]) {
                        this.debugLoyaltyToken("Checking token");
                        this.sendGetCommand("Update tokes","loyalty_tokens.json","",this.cities[0],this.bind(this.checkLoyalyToken));
                    }
                    return(60*1000*60);
                };
                this.checkLoyalyToken = function checkLoyalyToken() {
                    this.trace();
                    if(this.tokens) {
                        for(var i=0; i<this.tokens.length; i++) {
                            if(this.tokens[i].collectable) {
                                this.debugLoyaltyToken("Collect token");
                                this.sendCommand("Collect token","loyalty_tokens/collect.json","type="+this.tokens[i].type,this.cities[0]);
                                this.addStat("Token",1);
                            }
                        }
                    }
                };
                //------ END COLLECT FUNCTIONS ----

                //------- BUILD FUNCTIONS -----
				this.calcBuldingCost = function calcBuldingCost(level,cost) {
					return cost * Math.pow(2,(level - 1));
				};
				this.calcReseachCost = function calcReseachCost(level,cost) {
					for(var i=1; i<level; i++) {
						cost *= 1.5;
					}
					return cost;
				};
				this.hasResources = function hasResources(city,name,cost,level,func) {
					if(cost && city && city.data && city.data.resources) {
						var res = city.data.resources;
						for (var c in cost) {
							var rc = func(parseInt(level,10),cost[c]);
							if(rc > parseInt(res[c],10)) {
							    if(func == this.calcBuldingCost) {
								    this.debugBuild("Can't build "+name+" because "+c+" ("+rc+") is more then "+res[c],city);
							    } else {
								    this.debugResearch("Can't research "+name+" because "+c+" ("+rc+") is more then "+res[c],city);
							    }
								return false;
							}
						}
						for (var cc in cost) {
							var dc = func(level,cost[cc]);
							city.data.resources[cc] = parseInt(city.data.resources[cc],10) - dc;
						}
					} else if(cost) {
					    if(func == this.calcBuldingCost) {
						    this.debugBuild("Missing city data");
					    } else {
						    this.debugResearch("Missing city data");
					    }
					} else {
					    if(func == this.calcBuldingCost) {
						    this.debugBuild("Missing cost for "+name);
					    } else {
						    this.debugResearch("Missing cost for "+name);
					    }
					}
					return true;
                };
                this.buildNewBuilding = function buildNewBuilding(neighborhood) {
                    this.trace();
					if(neighborhood && neighborhood.buildings && neighborhood.city) {
					    var city = neighborhood.city;
                        if(city.type == "DoriaAirport") {
                            this.debugBuild("Do not build new building in Doria Airport",city);
                            return false;
                        }
                        var manLvl = this.findBuildingLevel("Mansion",neighborhood.city);
                        var cap = manLvl * 3 + 10;
                        var total = this.countBuilding(neighborhood);
                        this.debugBuild("Man Level: "+manLvl+" Total building: "+ total+" => "+cap,city);
                        if(cap > total) {
                            var slot = this.findBuildingSlot(neighborhood);

                            var build = "Hideout";
                            for(var b in buildings) {
                                var prio = buildings[b];
                                var buildCountGoal = 0;
                                if(this.options.build[b]) {
                                    buildCountGoal = this.options.build[b];
                                } else if(prio.buildNew) {
                                    buildCountGoal = prio.buildNew;
                                }
                                if(buildCountGoal) {
                                    var buildCount = this.countBuilding(neighborhood,b);
                                    if(buildCount < buildCountGoal) {
										var cost = prio.cost;
										if(!this.hasResources(city,b,cost,1,this.calcBuldingCost)) {
											continue;
										}
                                        build = b;
                                        break;
                                    }
                                }
                            }

                            this.updateInfo("Build new "+build+" at slot "+slot,city);
                            var data = "_method=post&city_building[building_type]="+build;
                            data += "&city_building[include_requirements]=false&city_building[instant_build]=false";
                            data += "&city_building[neighborhood_id]="+neighborhood.id+"&city_building[slot]="+slot;
                            this.sendCommand("Build new "+build+" at slot "+slot+" in "+city.type,"cities/"+city.id+"/buildings.json",data,city);
                            this.addStat("Build",1);
                            neighborhood.buildings.push({'slot': slot, 'location': "neighborhood", 'type': build});
                            return true;
                        } else {
                            this.debugBuild("No more slots for new buildings ("+cap+")",city);
                        }
                    } else {
                        this.debugBuild("Can't find neighborhood or buildings",city);
                    }
                    return false;
                };
                this.upgradeImportentBuilding = function upgradeImportentBuilding(neighborhood,lowLevel) {
                    this.trace();
					var importent = ["Hideout","Apartment"];
                    for(var i=0; i<importent.length; i++) {
                        var im = importent[i];
                        var imLvl = this.findBuildingLevel(im,neighborhood.city);
                        if(imLvl < 9 && neighborhood && neighborhood.buildings) {
							var buildings = neighborhood.buildings;
                            for(var b=0; b<buildings.length; b++) {
                                var building = buildings[b];
                                if(building.type == im && building.level == imLvl) {
                                    lowLevel.lvl = building.level;
                                    lowLevel.id = building.id;
                                    lowLevel.name = building.type;
                                    lowLevel.location = building.location;
                                    this.debugBuild("Build Importent "+lowLevel.name,neighborhood.city);
                                    return lowLevel;
                                }
                            }
                        }
                    }
                    this.debugBuild("Failed to find impotent building",neighborhood.city);
                    return lowLevel;
                };
                this.upgradeLowestBuilding = function upgradeLowestBuilding(neighborhood) {
                    this.trace();
					if(this.buildNewBuilding(neighborhood)) {
                        return true;
                    }
                    var lowLevel = {};
                    lowLevel.lvl = 20;
                    lowLevel.id = "";
                    lowLevel.location = "";
                    if(neighborhood && neighborhood.buildings) {
						var buildings = neighborhood.buildings;
						var city = neighborhood.city;
                        for(var b=0; b<buildings.length; b++) {
                            var building = buildings[b];
                            if(!building.hasOwnProperty('unlocked') && building.level  < 9) {
                                var canBuild = true;
                                var prio = buildings[building.type];
                                if(prio && prio.requirement) {
                                    var reqs = prio.requirement;
                                    if(reqs.build) {
                                        var build_prio = reqs.build[building.level];
                                        if(build_prio) {
                                            for(var req in build_prio) {
                                                var lvl = this.findBuildingLevel(req,neighborhood.city);
                                                if(lvl < build_prio[req]) {
                                                    this.debugBuild("Can't build "+building.type+" because "+req+" is not "+build_prio[req],city);
                                                    canBuild = false;
                                                    break;
                                                } else {
                                                    this.debugBuild(building.type+" has req "+req+" ("+build_prio[req]+") and it is "+lvl,city);
                                                }
                                            }
                                        }
                                    }
                                    if(reqs.gangster && reqs.gangster > this.player_level) {
                                       this.debugBuild("Can't build "+building.type+" because gangster is not "+reqs.gangster,city);
                                       canBuild = false;
                                       break;
                                    } else if(reqs.gangster) {
                                        this.debugBuild(building.type+" has gangster "+reqs.gangster+" and we are "+this.player_level,city);
                                    }
                                } else {
                                    this.debugBuild(building.type+" has no requirements",city);
                                }
                                if(canBuild && prio && prio.cost) {
                                    if(!this.hasResources(city,building.type,prio.cost,building.level,this.calcBuldingCost)) {
                                        canBuild = false;
                                    } else {
                                        this.debugBuild("Lots of resources",city);
                                    }
                                } else if(canBuild) {
                                    this.debugBuild("Not cost info for "+building.type,city);
                                }
                                if(canBuild &&
                                    (lowLevel.lvl > building.level || (building.level > 3 && lowLevel.lvl == building.level && lowLevel.location == "neighborhood")))
                                {
                                    lowLevel.lvl = building.level;
                                    lowLevel.id = building.id;
                                    lowLevel.name = building.type;
                                    lowLevel.location = building.location;
                                    lowLevel.building = building;
                                }
                            }
                        }
                        if(lowLevel.lvl != 20) {
                            if(lowLevel.lvl > 5) {
                                var tmp = this.upgradeImportentBuilding(neighborhood,lowLevel);
                                if(this.hasResources(city,tmp.name,buildings[tmp.name].cost,tmp.lvl,this.calcBuldingCost)) {
                                    lowLevel = tmp;
                                } else {
                                    this.debugBuild("Do not upgrade importent building, not egnogh rescources",city);
                                }
                            }
    						this.updateInfo("Build "+lowLevel.name+" "+(lowLevel.lvl+1),city);
    						this.sendCommand("Build "+lowLevel.name+" "+(lowLevel.lvl+1)+" in "+city.type,"cities/"+city.id+"/buildings/"+lowLevel.id+".json","_method=put",city);
    						lowLevel.building.level++;
    						return true;
                        }
                    }
                    return false;
                };
                this.doBuild = function doBuild() {
                    this.trace();
					if(this.cities) {
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
                            if(city.type == "DoriaAirport") {
                              this.debugBuild("Build is disabled for Doria Airport",city);
                              return;
                            }
                            var doUpgrade = this.checkCityQueue(city,"building");
                            if(doUpgrade) {
                                if(city.neighborhood) {
    								for(var n=0; n<city.neighborhood.length; n++) {
    									if(this.upgradeLowestBuilding(city.neighborhood[n])) {
    									    break;
    									}
                                    }
							    } else {
							        this.debugBuild("Neighborhood not ready",city);
							    }
                            } else {
							    this.debugBuild("Build queue not ready",city);
                            }
                        }
                    } else {
                        this.debugBuild("Cities not ready");
                    }
                };
                //------- END BUILD FUNCTIONS ----

                //------- RESEARCH FUNCTIONS -----
                this.researchLowest = function researchLowest(city) {
                    this.trace();
					var lowLevel = {'lvl': 20, 'pri': 20, 'id': ""};
                    if(city && city.data && city.data.research && city.neighborhood) {
                        for(var key in research) {
                            var currentResearch = city.data.research[key], skip = false;
                            if(currentResearch === undefined) {
                                currentResearch = 0;
                            }
                            if(research[key]) {
                                var prio = research[key];
                                if(prio.requirement) {
                                    var req = prio.requirement;
                                    if(req) {
                                        if(req.build) {
                                            var build = this.findBuildingLevel(req.build,city);
                                            this.debugResearch(key+" ("+currentResearch+"/"+(currentResearch-4)+") has req "+req.build+" and it is "+build+" ("+(build*4)+")",city);

                                            if(req.build == "Garage" || req.build == "Workshop" || req.build == "GuardPost") {
                                                build *= 4;
                                            } else {
                                                build *= 2;
                                            }
                                            if(currentResearch > 1 && build <= currentResearch) {
                                                this.debugResearch("skip because "+build+" is less then "+currentResearch,city);
                                                skip = true;
                                            }
                                        }
                                        if(!skip && req.research) {
                                            for(var i=0; i<req.research.length; i++) {
                                                var r = req.research[i], resLvl = city.data.research[r];
                                                if(resLvl === undefined) {
                                                    resLvl = 0;
                                                }
                                                this.debugResearch(key+" has req "+r+" and it is "+resLvl,city);
                                                if(resLvl <= currentResearch) {
                                                    this.debugResearch("Skip because "+resLvl+" is less then "+currentResearch,city);
                                                    skip = true;
                                                }
                                            }
                                        }
                                    }
                                }
    							if(!skip) {
    								if(!this.hasResources(city,key,prio.cost,currentResearch,this.calcReseachCost)) {
    									this.debugResearch("Skip because we can't affort it",city);
    									skip = true;
    								}
    							}
                            }
                            if(!skip) {
                                if((lowLevel.lvl > currentResearch) ||
                                   (lowLevel.lvl == currentResearch &&
                                    lowLevel.pri > research[key].priority))
                                {
                                    lowLevel.lvl = currentResearch;
                                    lowLevel.name = key;
                                    lowLevel.pri = research[key].priority;
                                }
                            }
                        }
                    }
                    if(lowLevel.lvl != 20) {
                        this.updateInfo("Research "+lowLevel.name+" lvl "+(lowLevel.lvl+1),city);
                        this.sendCommand("Research "+lowLevel.name+" lvl "+(lowLevel.lvl+1)+" in "+city.type,"cities/"+city.id+"/researches.json","research[research_type]="+lowLevel.name,city);
                        this.addStat("Research",1);
                        city.data.research[lowLevel.name] = (lowLevel.lvl+1);
                    }
                };
                this.doResearch = function doResearch() {
                    this.trace();
					if(this.cities) {
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
                            if(city.type != "DoriaAirport") {
                                var canResearch = this.checkCityQueue(city,"research");
                                if(canResearch) {
                                    this.researchLowest(city);
                                } else {
                                    this.debugResearch("Already researching",city);
                                }
                            }
                        }
                    }
                };
                //------------- END RESEARCH FUNCTIONS ------

                //------------- TRAIN FUNCTIONS -----------
                this.doTrain = function doTrain() {
                    this.trace();

					if(this.cities && this.options.trainOrders) {
					    this.debugTrain(this.options.trainOrders);
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
                            if(city.type != "DoriaAirport") {
    							for(var unit in attackUnits) {
    								var count = this.options.trainOrders[unit];
    								if(count) {
    								    if(city && city.data && city.data.units) {
    									    var amount = 10;
    									    var unit_count = 0;
    									    if(city.data.units[unit]) {
    									        unit_count = city.data.units[unit];
    									    }
    									    if(unit_count >= count) {
    										    this.debugTrain("Do not train "+unit+", there is "+unit_count,city);
    									    } else if(this.checkCityQueue(city,"units")) {
    									        this.debugTrain("Train "+amount+" "+unit,city);
    									        this.sendTrainOrders(unit, amount, city);
    									        this.addStat("Train",amount);
    										    break;
    									    } else {
    										    this.debugTrain("Already training units",city);
    									    }
    								    } else {
    								        this.debugTrain("Data is missing",city);
    								    }
    								} else {
    								    this.debugTrain("Do not train "+count+" "+unit,city);
    								}
    							}
                            }
                        }
                    } else {
                        this.debugTrain("Train data is not ready");
                    }
                };
                this.doDefense = function() {
                    this.trace();

                    if(this.cities) {
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
                            if(city.type != "DoriaAirport") {
                                if(this.checkCityQueue(city,"defense_units")) {
                                    var lastUnit = undefined;
                                    for(var unit in defenseUnits) {
                                        var skip = false;
                                        var req = defenseUnits[unit].requirement;
                                        if(req.build) {
                                            for(var b in req.build) {
                                                var build = this.findBuildingLevel(b,city);
                                                this.debugDefense(unit+" has build req "+b+" of "+req.build[b]+" and it is "+build,city);
                                                if(build < req.build[b]) {
                                                    this.debugDefense("Skipping",city);
                                                    skip = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if(!skip && req.research) {
                                            for(var r in req.research) {
                                                var resLvl = city.data.research[r];
                                                if(resLvl === undefined) {
                                                    resLvl = 0;
                                                }
                                                this.debugDefense(unit+" has req "+r+" of "+req.research[r]+" and it is "+resLvl,city);
                                                if(resLvl < req.research[r]) {
                                                    this.debugDefense("Skiping",city);
                                                    skip = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if(!skip) {
                                            lastUnit = unit;
                                            this.debugDefense("Can build "+unit,city);
                                        }
                                    }
                                    if(lastUnit) {
                                        var amount = 10;
                                        this.sendTrainOrders(lastUnit, amount, city);
                                        this.debugTrain("Train "+amount+" "+unit,city);
                                        this.addStat("Defense",amount);
                                    } else {
                                        this.debugDefense("Failed to find a unit to train",city);
                                    }
                                } else {
                                    this.debugDefense("Already training defense units",city);
                                }
                            }
                        }
                    }
                };
                this.sendTrainOrders = function(unit, amount, city) {
                    this.sendCommand("Train "+amount+" "+unit+" in "+city.type,"cities/"+city.id+"/units.json","_method=post&units[include_requirements]=false&units[quantity]="+amount+"&units[unit_type]="+unit,city);
                };
                //----------- END TRAIN FUNCTION -------

                //------------ BAILOUT FUNCTIONS ---------
                this.doBailout = function doBailout() {
                    this.trace();
					if(this.cities) {
                        for(var c=0; c<this.cities.length; c++) {
                            var city = this.cities[c];
                            if(city.type != "DoriaAirport") {
							    this.sendGetCommand("Update bail","cities/"+city.id+"/cash_jail.json","",city);
                            }
                        }
                    }
                };
                this.payBailout = function payBailout(city) {
                    this.trace();
					if(city) {
    			        if(city.bailout) {
    					    var cash = 0;
    					    if(city.data && city.data.resources) {
    					        cash = parseInt(city.data.resources.cash,10);
    					        /*if(cash < 1000000) {
    					            this.debugBailout("Money is "+city.data.resources.cash);
    					            return;
    					        }*/
    					    } else {
    					        this.debugBailout('No resources',city);
    					    }
                            var data = "";
                            var str = "";
                            var total_cost = 0;

                            for(var unit in city.bailout) {
                                var pay = 0;
                                if(attackUnits[unit] && attackUnits[unit].bailout) {
                                    var cost = attackUnits[unit].bailout;
                                    var all = parseInt(city.bailout[unit],10);
                                    var all_cost = cost * all;
                                    this.debugBailout(unit+" costs "+all_cost+" and all units costs "+total_cost+" and I have "+cash,city);
                                    var count = parseInt((cash-total_cost) / cost);
                                    if(count > 0) {
                                        count = count > all ? all : count;
                                        var count_cost = count * cost;
                                        this.debugBailout("I can affort "+count+" "+unit+" because it cost "+count_cost+" and I have "+(cash-total_cost)+" ("+cash+")",city);
                                        pay = count;
                                        total_cost += count_cost;
                                    } else {
                                        this.debugBailout("Can't affort "+unit+" because it cost "+cost+" and I have "+(cash-total_cost)+" ("+cash+")",city);
                                    }
                                } else {
                                    this.debug("Missing bailout for "+unit,city);
                                }
                                if(pay > 0) {
                                    data += "&units["+unit+"]="+pay;
                                    str += pay+" "+unit+", ";
                                }
                            }
                            city.bailout = {};
                            if(data !== "") {
                                this.debugBailout(str,city);
                                this.sendCommand("Pay Bailout in "+city.type,"cities/"+city.id+"/cash_jail/bail.json","payment_method=cash"+data,city);
                            } else {
                                this.debugBailout('No bailout data to send',city);
                            }
					    } else {
					        this.debugBailout('No bailout',city);
					    }
                    } else {
                        this.debugBailout('City is missing');
                    }
                };
                //------------ END BAILOUT FUNCTIONS ----

                //----------- ATTACK FUNCTIONS ---------
                this.updateMap = function updateMap() {
                    this.trace();
					if(!this.cities || !this.cities[0] || !this.cities[0].data) {
                        setTimeout(this.bind(this.updateMap),1000);
                    } else {
                        this.options.map_size+=2;
                        var offset = 10 * ((this.options.map_size-1) / 2);

                        if(!this.options.map_loaded) {
                            this.options.map_loaded = {};
                        }
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
                            if(city && city.data) {
                                var startX = city.x - offset;
                                if(startX < 0) {
                                    startX = 750 + startX;
                                }
                                var startY = city.y - offset;
                                if(startY < 0) {
                                    startY = 750 + startY;
                                }
                                for(var x = 0; x<this.options.map_size; x++) {
                                    for(var y=0; y<this.options.map_size; y++) {
                                        var getX = (startX+(x*10)) % 750;
                                        var getY = (startY+(y*10)) % 750;

                                        if(!this.options.map_loaded[getX]) {
                                            this.options.map_loaded[getX] = {};
                                        }
                                        if(!this.options.map_loaded[getX][getY]) {
                                            this.options.map_loaded[getX][getY] = true;
                                            this.debugAttack("Get map ("+getX+","+getY+")");
                                            this.sendSlowGetCommand("Get map ("+getX+","+getY+")","map.json","x="+getX+"&y="+getY,city,this.bind(this.drawMapInfo));
                                        } else {
                                            this.debugAttack("Not reloading ("+getX+","+getY+")");
                                        }
                                    }
                                }
                                this.saveOptions();
                            }
                        }
                    }
                };
                this.findBestGang = function findBestGang(city,level) {
                    this.trace();
					this.debugAttack("FindBestGang for "+city.type+" with lvl "+level);
                    var d = new Date();
                    var sel = {"lvl": 0};
                    var sel_dist = 1000;

                    for(var keyX in this.options.map) {
                        for(var keyY in this.options.map[keyX]) {
                            var gang = this.options.map[keyX][keyY];
                            if((gang.lvl == level || (level > 1 && gang.lvl == (level -1))) && (!gang.attacked || gang.attacked < d.getTime())) {
                                var distX = Math.abs(keyX-city.x);
                                if(distX > 250) {
                                    distX = Math.abs(750-distX);
                                }
                                var distY = Math.abs(keyY-city.y);
                                if(distY > 250) {
                                    distY = Math.abs(750-distY);
                                }
                                if((sel.lvl < gang.lvl) || ((distX + distY) < sel_dist && sel.lvl === gang.lvl)) {
                                    sel_dist = distX + distY;
                                    sel = gang;
									this.debugAttack("Found better Gang "+sel.lvl+" at ("+keyX+","+keyY+") with dist ("+distX+" + "+distY+") = "+sel_dist);
                                }
                            }
                        }
                    }
					return sel;
                };
                this.doAttack = function doAttack() {
                    this.trace();
                    var t = 60000;
                    var d = new Date();
					if(!this.cities || !this.cities[0] || !this.cities[0].data) {
                        return(1000);
                    }

                    if(!this.options.map) {
                        this.updateMap();
                        return(10000);
					}

                    if(this.cities && this.options.attackOrders) {
                        for(var c=0; c<this.cities.length; c++) {
                            var city = this.cities[c];
                            if(city && city.data && city.energy > 1) {
                                var bestOrder = {"gang":0};
                                for(var i=0; i<this.options.attackOrders.length; i++) {
                                    var order = this.options.attackOrders[i];
                                    this.debugAttack("Order: "+order.gang+" City: "+order.city+" Units: "+order.units,city);

                                    var doIt = false;
									if(!order.city || order.city == 'all' || order.city == city.type) {
										doIt = true;
									} else {
										this.debugAttack("Wrong city",city);
									}
									if(doIt) {
										var aUnits = JSON.parse(order.units);
										for(var u in aUnits) {
											if(!city.data.units[u] || city.data.units[u] < aUnits[u]) {
												this.debugAttack("Do not have "+u+" ("+aUnits[u]+")",city);
												doIt = false;
												break;
											}
										}
									}
                                    if(doIt) {
                                        var bestLvl = parseInt(bestOrder.gang,10);
                                        var lvl = parseInt(order.gang,10);
                                        if(bestLvl < lvl) {
                                            bestOrder = order;
                                        }
                                    }
                                }
                                if(bestOrder.units) {
                                    var attackGang = this.findBestGang(city,bestOrder.gang);
                                    if(attackGang.lvl > 0) {
                                        this.debugAttack("Attack "+attackGang.lvl+" Gang at ("+attackGang.x+","+attackGang.y+")",city);
                                        if(attackGang.lvl <= 10) {
                                            attackGang.attacked = d.getTime() + (30 * 60 * 1000);
                                        }
										var units = bestOrder.units;
										if(bestOrder.use_all) {
											units = this.getAttackUnits(city);
										}
                                        this.attack(attackGang.x,attackGang.y,units,city);

                                        t = 600000;
                                        this.saveOptions();
                                    } else {
                                        this.debugAttack("Failed to find a gang to attack",city);
                                    }
                                }
                            } else {
								this.debugAttack("No more energy",city);
							}
                        }
                    } else {
						this.debugAttack("City or orders not ready");
					}
                    return(t);
                };
                this.getAttackUnits = function getAttackUnits(city) {
                    this.trace();
					if(city && city.data && city.data.units) {
                        var units = jQuery.extend(true, {}, city.data.units);
                        for(var def in defenseUnits) {
                            if(units[def]) {
                                delete units[def];
                            }
                        }
                        var total = 0;
                        for(var unit in units) {
                           if(total < city.maximum_troops) {

                              if(units[unit] > (city.maximum_troops - total))
                              {
                                        units[unit] = (city.maximum_troops - total);
                              }
                              this.debugAttack("Add attack units "+unit+ " => "+units[unit]+ " ("+total+"/"+city.maximum_troops+")",city);
                              total += units[unit];
                           } else {
                              delete units[unit];
                           }
                        }
                        return JSON.stringify(units);
                    }
                    return "";
                };
                this.attack = function attack(x,y,units,city) {
                    this.trace();
					this.sendCommand("Attack ("+x+","+y+") from "+city.type,"cities/"+city.id+"/marches.json","_method=post&march[x]="+x+"&march[y]="+y+"&march[units]="+units,city);
                    this.addStat("Attack",1);
                };
                //------------ END ATTACK FUNCTION -------

                //------------ PRIZE FUNCTIONS ------
                this.getPrize = function getPrize() {
                    this.trace();
					if(this.cities && this.cities[0] && this.minigame_timestamp) {
                        this.debugPrize("Get Prize");
                        this.sendCommand("Get Prize","minigames/save_result.json","minigame_timestamp="+this.minigame_timestamp,this.cities[0]);
                        this.addStat("Prize",1);
                    }
                };
                this.doPrize = function doPrize() {
                    this.trace();
					if(this.cities && this.cities[0]) {
					    if(this.free_ticket || (this.items && this.items.DailyChance && this.items.DailyChance > 0)) {
                            this.debugPrize("Update Prize");
                            this.sendGetCommand("Update Prize","minigames/index.json","",this.cities[0],this.bind(this.updatePrizeList));
					    } else {
					        this.debugPrize("No prize ticket - Update player data");
                            this.loadPlayerData();
                            return(5*60000);
					    }
                    } else {
						this.debugPrize("Cities not ready");
					}
					return(0);
                };
                //------- END PRIZE FUNCTIONS -----

                //------------ ITEMS FUNCTIONS ------
                this.doItems = function doItems() {
                  var collect = ['KickbackBundle100',   'KickbackBundle250',   'KickbackBundle1000',   'KickbackBundle3000',
                                 'AppointmentBundle100','AppointmentBundle250','AppointmentBundle1000','AppointmentBundle3000',
                                 'FavorBundle100',      'FavorBundle250',      'FavorBundle1000',      'FavorBundle3000',
                                 'AssortedResourcesBundle','InitiateBundle','TributeTicketBundle10'];
                  if(this.items) {
                      if(this.cities) {
                          var city = this.cities[0];
                          for(var i=0; i<collect.length; i++) {
                            if(this.items[collect[i]]) {
                              this.debugItems(collect[i]+": "+this.items[collect[i]]);
                              this.items[collect[i]]--;
                              this.sendCommand("Collect "+collect[i],"player_items/"+collect[i]+".json","_method=delete",city);
                              this.addStat("Item",1);
                              //return(1000);
                            }
                          }
                          this.loadPlayerData();
                      } else {
                          this.debugItems("Cities is not ready");
                      }
                  } else {
                      this.debugItems("Items is not ready");
                  }
                };
                //------- END ITEMS FUNCTIONS -----

                //------------ REPORT FUNCTIONS ------
                this.doReport = function doReport() {
                    this.debugReport("Do Reports");
                    this.sendGetCommand("Reports","reports.json","count=18&page=1&category=reports");
                };
                this.handleReport = function handleReport() {
                    this.debugReport("Handle Reports");
                    if(this.reports && this.reports.reports) {
                        var ids = "";
                        for(var i=0; i<this.reports.reports.length; i++) {
                            var r = this.reports.reports[i];
                            if(r.battle_side == "attacking" && r.battle_result == "Won" && r.read_at === null) {
                                ids += r.id+"|";
                            }
                        }
                        this.debugReport("Ids: "+ids);
                        if(ids !== "") {
                            this.sendCommand("Delete reports","reports/bulk_delete.json","_method=delete&ids="+ids);
                        }
                    }
                };
                //------- END REPORT FUNCTIONS -----

                this.doBonds = function doBonds() {
                    this.debugBonds("Get Bonds");
                    if(this.cities) {
                        var city = this.cities[0];
                        this.sendGetCommand("Get Bonds","bonds.json","action=index",city);
                    }
                };
                this.handleBonds = function handleBonds() {
                    this.debugBonds("Handle bonds");
                    if(this.cities) {
                        var city = this.cities[0];
                        this.sendCommand("Collect Bonds","bonds/redeem.json","action=index",city);
                    }
                };
                //------ SEND FUNCTIONS ----
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
                this.addMissingPrizeInfo = function addMissingPrizeInfo(str) {
                    if(!this.options.missing_prize) {
                        this.options.missing_prize = [];
                    }
                    this.options.missing_prize.push(str);
                    this.saveOptions();
                };
                this.showMissingPrizeInfo = function showMissingPrizeInfo() {
                    this.trace();
                    if(this.options.missing_prize) {
                        this.debug("Show Missing prizes");
                        for(var i=0; i<this.options.missing_prize.length; i++) {
                            var prize = this.options.missing_prize[i];
                           if(prizes[prize]) {
                               this.options.missing_prize.splice(i,1);
                           } else {
                               this.debug("Missing prize info: "+prize);
                           }
                        }
                        this.saveOptions();
                    } else {
                        this.debug("No missing prizes");
                    }
                };
                this.updatePrizeList = function updatePrizeList() {
                    this.trace();
                    var min = {"cost":1000,"name":""};

                    if(this.prizeList && this.prizeList.length) {
                        for(var i=0; i<this.prizeList.length; i++) {
                            if(prizes[this.prizeList[i].type]) {
                                if(min.cost > prizes[this.prizeList[i].type]) {
                                    min.cost = prizes[this.prizeList[i].type];
                                    min.name = this.prizeList[i].type;
                                }
                            } else {
                                this.updatePrizeInfo(this.prizeList[i].type +" is unknown");
                                this.addMissingPrizeInfo(this.prizeList[i].type);
                            }
                        }

                        if(min.cost >= 10) {
                            this.getPrize();
                            if(this.free_ticket) {
                                this.free_ticket = false;
                            } else if(this.items && this.items.DailyChance && this.items.DailyChance > 0) {
                                this.items.DailyChance--;
                            }
                            this.loadPlayerData();
                        }
                    }
                };
                this.drawOption = function drawOption(name) {
					var div = this.drawGenericOption(name,this.html.mainPanel,"enable_","changeEnable",this.options["enable"+name]);

					var sep = document.createElement("span");
                    sep.innerHTML = " - ";
                    div.appendChild(sep);

                    this.drawButton(name+" Now",this.bind(this["do"+name]),div);
				};
				this.drawDebugOption = function drawDebugOption(name) {
					this.drawGenericOption(name,this.html.DebugInfoData,"enable_debug_","changeDebugEnable",false);
				};
				this.drawGenericOption = function drawGenericOption(name,p,strEnable,optEnable,checked) {
                    var div = document.createElement("div");
					p.appendChild(div);

                    var span = document.createElement("div");
                    span.className = "option";
                    span.innerHTML = name+": ";
                    div.appendChild(span);

                    var input = document.createElement("input");
                    input.type = "checkbox";
                    input.name = strEnable+name;
                    input.id = strEnable+name;
                    input.checked = checked;
                    input.onclick = this.bind(this[optEnable+name]);
                    div.appendChild(input);
                    this.html[strEnable+name] = input;

					return div;
                };
                this.drawButton = function drawButton(name,func,cont) {
                    var button = document.createElement("input");
                    button.name = name;
                    button.value = name;
                    //button.className = "button";
                    button.type = "button";
                    button.onclick = func;
                    if(cont === undefined) {
                        this.html.mainPanel.appendChild(button);
                    } else {
                        cont.appendChild(button);
                    }
                };
                this.drawTab = function drawTab(id,name) {
                    var link = document.createElement("a");
                    link.href = "javascript:;";
                    link.className = "tabLink";
                    link.id = id;
                    link.innerHTML = name;
                    link.onclick = function() {
                        var tabeId = $(this).attr('id');
                        $(".tabLink").removeClass("activeLink");
                        $(this).addClass("activeLink");
                        $(".tabcontent").addClass("hide");
                        $("#"+tabeId+"_data").removeClass("hide");
                        return false;
                    };
                    return link;
                };
                this.drawTabData = function drawTabData(id) {
                    var div = document.createElement("div");
                    div.id = id+"_data";
                    div.className = "tabcontent hide";
                    return div;
                };
                this.drawPanel = function drawPanel() {
                    var panel = document.createElement("div");
                    panel.setAttribute("id","panel");
                    panel.setAttribute("class", "panel");
                    document.body.appendChild(panel);
                    this.html.panel = panel;

                    var header = document.createElement("p");
                    header.className = "header";
                    header.innerHTML = "The Underboss";
					header.onclick = function() {
						if($("#panel").hasClass("panel")) {
							$("#panel").removeClass("panel").addClass("hiddenPanel");
							$("#mainPanel").hide();
						} else {
							$("#panel").removeClass("hiddenPanel").addClass("panel");
							$("#mainPanel").show();
						}
					};
                    panel.appendChild(header);

					var mainPanel = document.createElement("div");
                    mainPanel.setAttribute("id","mainPanel");
                    this.html.panel.appendChild(mainPanel);
                    this.html.mainPanel = mainPanel;

                    for(var fun in this.autoFunctions) {
                        this.drawOption(fun);
                    }

                    //this.drawButton("Cities",this.bind(this.loadCitiesData));

                    var infoPanel = document.createElement("div");
                    mainPanel.appendChild(infoPanel);

                    var tabBox = document.createElement("div");
                    tabBox.className = "tab-box";
                    infoPanel.appendChild(tabBox);

                    var tabs = ["Info","Prizes","Attack","Map","Train","Build","Debug"];
                    for(var i=0; i<tabs.length; i++) {
                        tabBox.appendChild(this.drawTab("info-"+(i+1),tabs[i]));
                        var infoData = this.drawTabData("info-"+(i+1));
                        infoPanel.appendChild(infoData);
                        this.html[tabs[i]+"InfoData"] = infoData;
						if(this["draw"+tabs[i]+"Tab"]) {
							this["draw"+tabs[i]+"Tab"](infoData);
						}
                    }

                    this.listen("queue:update",this.updateDebugQueue);
                };
				this.drawDebugTab = function drawDebugTab(infoData) {
					$(infoData).html("<h7>Debug Info</h7>")
					    .append($("<div/>").attr("id","debug_jobs"))
					    .append($("<div/>").attr("id","debug_queue"));
					this.drawButton("Update Jobs",this.bind(this.loadCitiesData),infoData);
					this.drawButton("Execute",this.bind(this.executeCMD),infoData);
					this.drawButton("Trace",this.bind(this.toggleTrace),infoData);

					for(var fun in this.autoFunctions) {
                        this.drawDebugOption(fun);
                    }
                    this.listen("jobs:update",this.updateDebug);
                    this.listen("report:update",this.handleReport);
				};
				this.toggleTrace = function() {
				    this.enableTrace = !this.enableTrace;
				};
				this.executeCMD = function() {
					var cmd = window.prompt("Enter CMD","");
					try {
						var res = eval(cmd);
						if(res) {this.debug(res);}
					} catch(e) {
						alert(e);
					}
				};
				this.updateDebugQueue = function updateDebugQueue() {
				    $("#debug_queue").html("<h7>Queue: "+this.queue.length+"</h7><h7>Slow Queue: "+this.slow_queue.length+"</h7>");
                };
				this.updateDebug = function updateDebug() {
					var job = $("#debug_jobs").html("<h7>Jobs</h7>");
					if(this.cities) {
                        for(var i=0; i<this.cities.length; i++) {
                            var city = this.cities[i];
							if(city && city.data && city.data.jobs) {
							    var b = r = u = d = "&nbsp;";
							    for(var j=0; j<city.data.jobs.length; j++) {
                                    if(city.data.jobs[j].queue == "research") { r = "R";}
                                    if(city.data.jobs[j].queue == "building") { b = "B";}
                                    if(city.data.jobs[j].queue == "units") { u = "U";}
                                    if(city.data.jobs[j].queue == "defense_units") { d = "D";}
                                }
								job.append("<h7>"+city.type+" ("+city.data.jobs.length+") "+b+" "+r+" "+u+" "+d+"</h7>");
								/*for(var j=0; j<city.data.jobs.length; j++) {
								    job.append("<p>"+city.data.jobs[j].queue+"</p>");
								}*/
							}
						}
					}
				};
                this.drawBuildTab = function drawBuildTab(infoData) {
                    this.html.build = {};

                    if(!this.options.build) {
                        this.options.build = {};
                    }

                    infoData.innerHTML = "<h7>Build Orders</h7><p>Build this amount of buildings and the rest will be Hideout.</p>";
                    var table = document.createElement("table");
                    infoData.appendChild(table);

                    var saveChanges = false;
                    for(var b in buildings) {
                        if(buildings[b].buildNew) {
                            var tr = document.createElement("tr");
                            table.appendChild(tr);
                            var td = document.createElement("td");
                            td.innerHTML = b;
                            tr.appendChild(td);
                            td = document.createElement("td");
                            tr.appendChild(td);
                            var input = document.createElement("input");
                            if(this.options.build.hasOwnProperty(b) && typeof(this.options.build[b]) == 'number') {
                                input.value = this.options.build[b];
                            } else {
                                input.value = buildings[b].buildNew;
                                saveChanges = true;
                            }
                            this.html.build[b] = input;
                            td.appendChild(input);
                        }
                    }
                    if(saveChanges) {
                        this.saveBuildOrder();
                    }
                    this.drawButton("Save",this.bind(this.saveBuildOrder),infoData);
                };
                this.saveBuildOrder = function saveBuildOrder() {
                    this.options.build = {};
                    for(var b in buildings) {
                        if(buildings[b].buildNew) {
                            this.options.build[b] = parseInt(this.html.build[b].value,10);
                        }
                    }
                    this.saveOptions();
                };
                this.drawTrainTab = function drawTrainTab(infoData) {
                    infoData.innerHTML = "<h7>Training Orders</h7>";
					var table = $("<table/>");
                    $(infoData).append(table);
                    var count = 0;
                    var tr;
					for(var unit in attackUnits) {
					    if((count % 2) === 0) {
					        tr = $("<tr/>");
                            table.append(tr);
                        }
                        tr.append($("<td/>")
                            .text(unit))
                            .append($("<td/>")
                            .append($("<input class='number'/>")
                            .attr("id","unit_"+unit)));
						if(this.options.trainOrders && this.options.trainOrders[unit]) {
							$("#unit_"+unit).val(this.options.trainOrders[unit]);
						}
						count++;
                    }
                    this.drawButton("Save",this.bind(this.saveTrainOrder),infoData);
                };
				this.saveTrainOrder = function saveTrainOrder() {
					this.trace();
					if(!this.options.trainOrders) {
					    this.options.trainOrders = {};
					}
					for(var unit in attackUnits) {
						this.options.trainOrders[unit] = $("#unit_"+unit).val();
					}
					this.saveOptions();
				};
                this.drawMapInfo = function drawMapInfo() {
                    if(!this.html.map_info) {
                        this.html.map_info = document.createElement("div");
                        this.html.MapInfoData.appendChild(this.html.map_info);
                    }
                    if(!this.options.map_size) {
                        this.options.map_size = 2;
                        this.updateMap();
                    }
                    this.html.map_info.innerHTML = "<p>Scan size: "+this.options.map_size+"</p>";

                    var counts = {}, i, keyX;
                    for(keyX in this.options.map) {
                        for(var keyY in this.options.map[keyX]) {
                            var gang = this.options.map[keyX][keyY];
                            if(!counts[gang.lvl]) {
                                counts[gang.lvl] = 0;
                            }
                            counts[gang.lvl]++;
                        }
                    }
                    for(i=1; i <= 10; i++) {
                        if(counts[i]) {
                            this.html.map_info.innerHTML += "<p>Lvl "+(i)+" Gangs: "+counts[i]+"</p>";
                        }
                    }
                    for(i=1; i<=5; i++) {
                        if(counts[10+i]) {
                            this.html.map_info.innerHTML += "<p>Murder Inc. "+(i)+": "+counts[10+i]+"</p>";
                        }
                    }
                };
                this.drawMapTab = function drawMapTab(infoData) {
                    infoData.innerHTML = "<h7>Map</h7>";
                    this.drawButton("Update Map",this.bind(this.updateMap),infoData);
                    this.drawMapInfo();
                };
                this.drawAttackTab = function drawAttackTab(infoData) {
                    this.html.order = {};
                    infoData.innerHTML = "<h7>Attack Orders</h7>";

					$('<div>City:</div>')
					    .append($('<select id="select_attack_city"></select>'))
					    .appendTo($(infoData));
					this.listen('cities:update',function updateAttackCity() {
                         var city = $('#select_attack_city');
                         city.empty();
                         city.append($('<option value="all">All</option>'));
                         if(this.cities) {
                             for(var i=0; i<this.cities.length; i++) {
                                 city.append($('<option value="'+this.cities[i].type+'">'+this.cities[i].type+'</option>'));
                             }
                         }
                     });


					$('<div>Gang Level:</div>')
					    .append($('<select id="select_gang"></select>'))
					    .appendTo($(infoData));
					var gang = $('#select_gang');
                    for(var i=1; i<=15; i++) {
                        gang.append($('<option value="'+i+'">'+i+'</option>'));
                    }

					$('<div id="units_p">Units:</div>')
					    .append($('<select id="select_units"></select>'))
					    .appendTo($(infoData));
                    var units = $('#select_units');
                    for(var unit in attackUnits) {
						units.append($('<option value="'+unit+'">'+unit+'</option>'));
                    }

					$('<input type="text" id="unit_count" value="0" class="unit_count" />').appendTo($('#units_p'));
                    this.drawButton("Add",this.bind(this.addUnitToAttackOrder),document.getElementById('units_p'));

					$('<div>Use All:</div>')
					    .append('<input type="checkbox" id="check_attack_all" value="all"/>')
					    .appendTo($(infoData));

					$('<textarea id="total_units" class="textinfo"></textarea>').appendTo($(infoData));


                    this.drawButton("Save",this.bind(this.saveAttackOrder),infoData);
                    this.drawButton("Clear",this.bind(this.clearAttackOrder),infoData);

                    var line = document.createElement("hr");
                    infoData.appendChild(line);

                    var list = document.createElement("select");
                    list.size = "10";
                    list.width = "100%";
                    infoData.appendChild(list);
                    this.html.order.list = list;

                    this.drawButton("Delete",this.bind(this.deleteAttackOrder),infoData);

                    this.updateAttackOrders();
                };
				this.deleteAttackOrder = function deleteAttackOrder() {
                    var index = this.html.order.list.value;
                    this.options.attackOrders.splice(index,1);
                    this.updateAttackOrders();
                };
                this.updateAttackOrders = function updateAttackOrders() {
                    this.html.order.list.innerHTML = "";

                    if(this.options.attackOrders) {
                        for(var n=0; n<this.options.attackOrders.length; n++) {
							var order = this.options.attackOrders[n];
							if(!order.city) {
							    order.city = "all";
							}
							if(!order.use_all) {
							    order.use_all = false;
							}
                            var item = document.createElement("option");
                            this.html.order.list.appendChild(item);

                            item.value = n;
                            item.innerHTML = order.city+" | "+order.gang+" | "+(order.use_all?'t':'f')+" | "+order.units;
                        }
                    }
                };
                this.addUnitToAttackOrder = function addUnitToAttackOrder() {
					var total = $('#total_units');
                    if(total.val() !== "")
                    {
                        total.val(total.val() + ",");
                    }
					total.val(total.val()+'"'+$('#select_units').val()+'":'+$('#unit_count').val());
                };
                this.saveAttackOrder = function saveAttackOrder() {
                    var order = {};
                    order.gang = parseInt($('#select_gang').val(),10);
                    order.units = "{"+$('#total_units').val()+"}";
					order.city = $('#select_attack_city').val();
					order.use_all = $('#check_attack_all').is(":checked");

                    if(!this.options.attackOrders) {
                        this.options.attackOrders = [];
                    }
                    this.options.attackOrders.push(order);
                    this.saveOptions();

					this.clearAttackOrder();
                    this.updateAttackOrders();
                };
                this.clearAttackOrder = function clearAttackOrder() {
                    $('#total_units').val("");
                };
                this.updateStats = function updateStats() {
					var stat = $("#stats").html("<h3><u>Stats</u></h3>");
                    if(this.options.stats) {
                        for(var s in this.options.stats) {
                            stat.append($("<p>"+s+": "+this.options.stats[s]+"</p>"));
                        }
                    }
                };
                this.drawInfoTab = function drawInfoTab(infoData) {
					$(infoData).append($("<div></div>").addClass("stats").attr("id","stats"));
                    this.updateStats();
                    $(infoData).append($("<textarea></textarea>").addClass("info").attr("id","debug_info"));
                };
                this.drawPrizesTab = function drawPrizesTab(infoData) {
                    $(infoData).html("<h7>Prizes</h7>").append("<p>Prize Info:</p>").append($("<textarea/>").addClass("prize_info"));
                };
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
                this.updateInfo = function updateInfo(str,city) {
                    $("#debug_info").text(this.debug(str,city)+"\n"+$("#debug_info").text());
                };
                this.updatePrizeInfo = function updatePrizeInfo(str,city) {
					$(".prize_info").text(this.debug(str,city) +"\n"+$(".prize_info").text());
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

                this.init(data);
            }

			gfb = new GodfatherBot(C.attrs,attackUnits);
        };
        //---------------------- END OF INJECTED PART -----------------------------------
    };

    //Insert into the right iframe
    var str = "" + window.location.href;
    if(str.indexOf("platforms/kabam/game") != -1) {
        injectBotScript(main);
    } else {
        return;
    }

    /*window.onerror = function(msg, url, line) {
		console.debug(msg + " on line "+line);
        if(line !== 0) {
            var info = document.getElementById('debug_info');
            if(info) {
                info.innerHTML = msg + " on line "+line+"\n" + info.innerHTML;
            }
        }
    };*/

    function injectBotScript(src) {
        console.debug("Injecting Godfather Bot script");

        var script = document.createElement("script");
        script.innerHTML = "var attackUnits = "+attackUnits.toString()+";";
		script.innerHTML += "console.log(attackUnits);";
		script.innerHTML +=  "(" + src.toString() + ")();";
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
    }
})();
