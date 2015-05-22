var researchBot = {
    researchLowest: function researchLowest(city) {
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
    },
    doResearch: function doResearch() {
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
    }
};
