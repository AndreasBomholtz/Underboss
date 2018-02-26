var parserBot = {
    parseData: function parseData(data) {
        this.trace();

        var i, city, n;
        if(data) {
            if(typeof(data) == "string") {
                data = JSON.parse(data);
            } else {
                data = this.clone(data);
            }

            if(data.timestamp) {
                var d = new Date();
                var t = d.getTime() / 1000;
                this.time_diff = t - data.timestamp;
            }
            if(data.cities && data.cities[0] && data.cities[0].id) {
                if(!this.cities) {
                    this.cities = data.cities;
                    this.signal('cities:update');
                }
            }
            if(data.player_armory_items) {
                this.player_armory_items = data.player_armory_items;
                this.signal('player:armor:update');
            }
            if(data.alliance) {
                this.alliance = data.alliance;
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
                                var add = true;
                                for(i=0; i<city.neighborhood.length; i++) {
                                    if(city.neighborhood[i].id == neighborhood.id) {
                                        add = false;
                                        break;
                                    }
                                }
                                if(add) {
                                    neighborhood.city = city;
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
                    if(!city.type) {
                        city.type = data.city.type;
                    }

                    if(city.jobs && data.city.jobs) {
                        for(i=0; i<city.jobs.length; i++) {
                            var present = false;
                            for(n=0; n<data.city.jobs.length; n++) {
                                if(city.jobs[i].queue == data.city.jobs[n].queue) {
                                    present = true;
                                    break;
                                }
                            }
                            if(!present && city.jobs[i].queue && city.jobs[i].id) {
                                this.handleQueueComplete(city.jobs[i].queue);
                            }
                        }
                    }
                    if(data.city.units) {
                        city.units = data.city.units;
                        this.signal("units:update");
                    }
                    if(data.city.research) {
                        city.research = data.city.research;
                        this.signal("research:update");
                    }
                    if(data.city.resources) {
                        city.resources = data.city.resources;
                        this.signal("resources:update");
                    }
                    if(data.city.figures && data.city.figures.marches) {
                        city.maximum_troops = data.city.figures.marches.maximum_troops;
                    }
                    if(data.city.wildernesses) {
                        city.wildernesses = data.city.wildernesses;
                    }
                    if(data.city.jobs) {
                        city.jobs = data.city.jobs;
                        this.signal("jobs:update");
                    }
                    if(data.city.equipped_armory_items) {
                        city.armor = data.city.equipped_armory_items;
                        this.signal("city:armor:update",city);
                    }
                }
            }
            if(data.terrain) {
                if(!this.options.map) {
                    this.options.map = {};
                }
                var terrain = data.terrain;
                for(var key1 in terrain) {
                    var d2 = terrain[key1];
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
                this.signal("map:update");
            }
            if(data.has_free_ticket) {
                this.free_ticket = data.has_free_ticket;
            }
            if(data.items) {
                this.my_items = data.items;
                this.signal('player:items');
            }
            if(data.quests) {
                this.quests = data.quests;
                this.signal("player:quests");
            }
            if(data.level) {
                this.player_level = data.level;
                this.signal("player:level");
            }
            if(data.result) {
                var result = data.result;
                if(data.result.prize_list) {
                    this.prizeList = result.prize_list;
                    this.minigame_timestamp = result.minigame_timestamp;
                } else if(data.result.item_won) {
                    for(var item in data.result.item_won) {
                        if(this.cities) {
                            this.updatePrizeInfo("Won: " +item, this.cities[0]);
                        } else {
                            this.updatePrizeInfo("Won: " +item);
                        }
                    }
                }
                if(data.result.prize) {
                    city = this.getCity(data.result.city_id);
                    if(data.result.prize.prize_type) {
                        this.updatePrizeInfo("Won: " + data.result.prize.prize_type, city);
                    } else {
                        for(var prize in data.result.prize) {
                            if(prize != "cash_multiplier") {
                                this.updatePrizeInfo("Won: " + prize  + " " + data.result.prize[prize], city);
                            }
                        }
                    }
                }
                if(data.result.job) {
                    city = this.getCity(data.result.job.city_id);
                    if(city) {
                        if(!city.jobs) {
                            city.jobs = [];
                        }

                        city.jobs.push(data.result.job);
                        this.signal("jobs:update");
                    }
                }
                if(this.lastCommand && this.lastCommand.city) {
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
                    this.reports.total = parseInt(data.result.total, 10);
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
                if(data.result.financiers_office) {
                    if(data.result.financiers_office.remaining_trades) {
                        this.financier_trades = data.result.financiers_office.remaining_trades;
                    }
                    this.handleFinancier();
                }
            }
            if(data.energy && this.lastCommand && this.lastCommand.city) {
                this.lastCommand.city.energy = data.energy;
            }
        }
    }
};
module.exports = parserBot;
