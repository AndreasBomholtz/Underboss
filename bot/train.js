var trainBot = {
    doTrain: function doTrain() {
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
    },
    doDefense: function() {
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
    },
    sendTrainOrders: function(unit, amount, city) {
        this.sendCommand("Train "+amount+" "+unit+" in "+city.type,
						 "cities/"+city.id+"/units.json",
						 "_method=post&units[include_requirements]=false&units[quantity]="+amount+"&units[unit_type]="+unit,
						 city);
    }
};
