var buildBot = {
	findBuildingLevel: function findBuildingLevel(name,city) {
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
    },
	countBuilding: function countBuilding(neighborhood,name) {
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
    },
	findBuildingSlot: function findBuildingSlot(neighborhood) {
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
    },
    calcBuldingCost: function calcBuldingCost(level,cost) {
        return cost * Math.pow(2,(level - 1));
    },
    hasResources: function hasResources(city,name,cost,level,func) {
        if(cost && city && city.data && city.data.resources) {
            var res = city.data.resources;
            for (var c in cost) {
                var rc = 0;
				if(func) {
					rc = func(parseInt(level,10),cost[c]);
				} else {
					rc = cost[c] * level;
				}
                if(rc > parseInt(res[c],10)) {
					if(func === undefined) {
						this.debugTrain("Can't train "+name+" because "+c+" ("+rc+") is more then "+res[c],city);
                    } else if(func == this.calcBuldingCost) {
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
    },
    buildNewBuilding: function buildNewBuilding(neighborhood) {
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
                for(var b in this.buildings) {
                    var prio = this.buildings[b];
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
    },
    upgradeImportentBuilding: function upgradeImportentBuilding(neighborhood,lowLevel) {
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
    },
    upgradeLowestBuilding: function upgradeLowestBuilding(neighborhood) {
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
                    var prio = this.buildings[building.type];
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
                    if(this.hasResources(city,tmp.name,this.buildings[tmp.name].cost,tmp.lvl,this.calcBuldingCost)) {
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
    },
    doBuild: function doBuild() {
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
    }
};
