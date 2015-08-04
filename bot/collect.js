var collectBot = {
    doCollect: function doCollect() {
        this.trace();
        if(!this.cities) {
	    this.debugCollect("Cities is not ready");
	    return(5000);
	}

        for(var i=0; i<this.cities.length; i++) {
            var city = this.cities[i];
            if(!city || !city.neighborhood) {
		this.debugCollect("Neighborhood not ready",city);
		continue;
	    }

            for(var n=0; n<city.neighborhood.length; n++) {
                var neighborhood = city.neighborhood[n];
                if(!neighborhood || !neighborhood.buildings) {
		    this.debugCollect("Building not ready",city);
		    continue;
		}
                
		var buildings = neighborhood.buildings;
                for(var b=0; b<buildings.length; b++) {
                    var building = buildings[b];
                    if(!building.hasOwnProperty('unlocked') || !building.unlocked) {
			this.debugCollect(building.type+" is not unlocked",city);
			continue;
		    }
                    
		    var do_collect = this.checkCityQueue(neighborhood.city,undefined,building.id);
                    if(do_collect) {
                        this.debugCollect("Collect "+building.type,city);
                        var url = "cities/"+neighborhood.city.id+"/npc_buildings/"+building.id+".json";
                        var parm = "_method=put&city_building_id="+building.id;
                        this.sendCommand("Collect "+building.type+" in "+city.type,url,parm,neighborhood.city);
                        this.addStat("Collect",1);
                    }
                }
            }
        }
        
        return(1000);
    },
    doExchange: function doExchange() {
        this.trace();
        if(!this.cities || !this.cities[0] || !this.cities[0].neighborhood || !this.cities[0].neighborhood.length) {
	    this.debugCollect("Neighborhood not ready");
	    return(0);
	}

        var city = this.cities[0];
        if(city && city.neighborhood && city.neighborhood.length) {
            for(var n=0; n<this.cities[0].neighborhood.length; n++) {
                var neighborhood = this.cities[0].neighborhood[n];
                if(!neighborhood || !neighborhood.buildings) {
		    this.debugCollect("Building not ready",city);
		    continue;
		}
		
                for(var b=0; b<neighborhood.buildings.length; b++) {
                    if(neighborhood.buildings[b].type == "Exchange") {
                        if(!neighborhood.buildings[b].free_ticket) {
			    this.debugExchange("No free ticket",city);
			    break;
			}
			
                        var url = "cities/"+city.city_id+"/exchanges/"+neighborhood.buildings[b].id+"/collect.json";
                        var data = "_method=put&_action=collect&city_building_id="+neighborhood.buildings[b].id;
                        this.sendCommand("Collect Exchange",url,data,this.cities[0]);
                        neighborhood.buildings[b].free_ticket = false;
                        this.updateInfo("Collect Exchange");
                        this.addStat("Exchange",1);
                        return(60*60*1000);
                    }
                }
	    }	
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
        if(!this.tokens) {
	    this.debugLoyaltyToken("No tokens");
	    return;
	}

        for(var i=0; i<this.tokens.length; i++) {
            if(this.tokens[i].collectable) {
                this.debugLoyaltyToken("Collect token: "+this.tokens[i].type+" ("+i+")");
                this.sendCommand("Collect token",
				 "loyalty_tokens/collect.json",
				 "type="+this.tokens[i].type,this.cities[0]);
                this.addStat("Token",1);
            }
        }
    },
    doQuests: function doQuests() {
	this.trace();
	if(!this.quests) {
	    this.debugQuests("No Quests yet");
	    return;
	}

	if(!this.quests.Completed) {
	    this.debugQuests("No Completed Quests");
	    return;
	}

	var quest = this.quests.Completed[0].name;
	this.debugQuests("Collect quest: "+quest);
	this.sendCommand("Collect Quest",
			 "player_quests/claim.json",
			 "quest_name="+quest+"&_method=put",
			 this.cities[0]);
    }
};
