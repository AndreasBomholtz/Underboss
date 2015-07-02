var trainBot = {
	checkRequirements: function(name, req, city, debug) {
		if(req.build) {
			for(var b in req.build) {
                var build = this.findBuildingLevel(b,city);
				this["debug"+debug](name+" has build req "+b+" of "+req.build[b]+" and it is "+build,city);
				if(build < req.build[b]) {
					this["debug"+debug]("Skipping "+name,city);
					return(false);
				}
			}
		}
		if(req.research) {
			for(var r in req.research) {
				var resLvl = city.research[r];
				if(resLvl === undefined) {
					resLvl = 0;
				}
				this["debug"+debug](name+" has req "+r+" of "+req.research[r]+" and it is "+resLvl,city);
				if(resLvl < req.research[r]) {
					this["debug"+debug]("Skiping "+name,city);
					return(false);
				}
			}
		}
		return(true);
	},
    doTrain: function doTrain() {
        this.trace();

        if(!this.cities) {
			this.debugTrain("Cities is not ready");
			return;
		}

		if(!this.options.trainOrders) {
			this.debugTrain("Train data is not ready");
			return;
		}

        this.debugTrain(this.options.trainOrders);

		for(var i=0; i<this.cities.length; i++) {
            var city = this.cities[i];
            if(!city || city.type == "DoriaAirport") {
				continue;
			}

            for(var unit in this.attackUnits) {
				var aUnit = this.attackUnits[unit];
				if(!aUnit.trainable) {
					this.debugTrain(unit+" is not trainable",city);
					continue;
				}

				if(aUnit.city && aUnit.city != "All" && aUnit.city != city.type) {
					this.debugDefense(unit+" can't be trained in "+city.type+" only in "+aUnit.city);
					continue;
				}

				var count = this.options.trainOrders[unit];
				if(!count) {
					this.debugTrain("Do not train "+count+" "+unit,city);
					continue;
				}

				if(!city.units) {
					this.debugTrain("city.units is missing",city);
				}

				var skip = false;
				var req = aUnit.requirement;
				if(!this.checkRequirements(unit, req, city, "Train")) {
					continue;
				}

				var amount = 10;
				var unit_count = 0;
				var cost = aUnit.cost;
				if(city.units[unit]) {
					unit_count = city.units[unit];
				}
				if(unit_count >= count) {
					this.debugTrain("Do not train "+unit+", there is "+unit_count,city);
				} else if(this.checkCityQueue(city,"units")) {
					if(cost === undefined || this.hasResources(city,unit,cost,amount,undefined)) {
						this.debugTrain("Train "+amount+" "+unit,city);
						this.sendTrainOrders(unit, amount, city);
						this.addStat("Train",amount);
						break;
					}
				} else {
					this.debugTrain("Already training units",city);
				}
			}
		}
    },
    doDefense: function() {
        this.trace();

        if(!this.cities) {
			this.debugDefense("Cities not ready");
			return;
		}

        for(var i=0; i<this.cities.length; i++) {
            var city = this.cities[i];
            if(city.type == "DoriaAirport") {
				continue;
			}

			if(!this.checkCityQueue(city,"defense_units")) {
                this.debugDefense("Already training defense units",city);
				continue;
			}

			var lastUnit = undefined;
            var amount = 10;
            for(var unit in this.defenseUnits) {
				var dUnit = this.defenseUnits[unit];
				if(!dUnit.trainable) {
					this.debugDefense(unit+" is not trainable",city);
					continue;
				}

				if(dUnit.city && dUnit.city != "All" && dUnit.city != city.type) {
					this.debugDefense(unit+" can't be trained in "+city.type+" only in "+dUnit.city);
					continue;
				}

				var skip = false;
				var req = this.defenseUnits[unit].requirement;
				if(!this.checkRequirements(unit, req, city, "Defense")) {
					continue;
				}

				var cost = this.defenseUnits[unit].cost;
				if(cost) {
					if(!this.hasResources(city,unit,cost,amount,undefined)) {
						continue;
					}
				}

				lastUnit = unit;
				this.debugDefense("Can build "+unit,city);
			}
			if(lastUnit) {
				this.sendTrainOrders(lastUnit, amount, city);
				this.debugTrain("Train "+amount+" "+unit,city);
				this.addStat("Defense",amount);
			} else {
				this.debugDefense("Failed to find a unit to train",city);
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
