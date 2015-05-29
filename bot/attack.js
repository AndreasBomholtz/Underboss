var attackBot = {
    updateMap: function updateMap() {
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
    },
    findBestGang: function findBestGang(city,level) {
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
    },
    doAttack: function doAttack() {
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
    },
    getAttackUnits: function getAttackUnits(city) {
        this.trace();
        if(city && city.data && city.data.units) {
            var units = jQuery.extend(true, {}, city.data.units);
            for(var def in this.defenseUnits) {
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
    },
    attack: function attack(x,y,units,city) {
        this.trace();
        this.sendCommand("Attack ("+x+","+y+") from "+city.type,"cities/"+city.id+"/marches.json","_method=post&march[x]="+x+"&march[y]="+y+"&march[units]="+units,city);
        this.addStat("Attack",1);
    }
};
