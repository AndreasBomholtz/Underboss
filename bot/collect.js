var collectBot = {
    doCollect: function doCollect() {
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return(1000);
    },
    doCityscape: function doCityscape() {
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
                                    this.sendCommand("Collect Cityscape in "+city.type,
													 "cities/"+city.id+"/wildernesses/collect_all.json",
													 '',city);
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
    },
    doExchange: function doExchange() {
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
    },
    doLoyaltyToken: function doLoyaltyToken() {
        this.trace();
        if(this.cities && this.cities[0]) {
            this.debugLoyaltyToken("Checking token");
            this.sendGetCommand("Update tokes",
								"loyalty_tokens.json",
								"",
								this.cities[0],this.bind(this.checkLoyalyToken));
        }
        return(60*1000*60);
    },
    checkLoyalyToken: function checkLoyalyToken() {
        this.trace();
        if(this.tokens) {
            for(var i=0; i<this.tokens.length; i++) {
                if(this.tokens[i].collectable) {
                    this.debugLoyaltyToken("Collect token");
                    this.sendCommand("Collect token",
									 "loyalty_tokens/collect.json",
									 "type="+this.tokens[i].type,this.cities[0]);
                    this.addStat("Token",1);
                }
            }
        }
    }
};
