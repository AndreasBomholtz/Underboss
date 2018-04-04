var attackBot = {
    resetMap: function resetMap() {
        this.trace();
        this.options.map_size = 3;
        this.options.map_loaded = {};
        this.updateMap();
    },
    updateMap: function updateMap(bot) {
        if(!bot) {
            bot = this;
        }

        bot.trace();
        if(!bot.cities || !bot.cities[0]) {
            setTimeout(bot.updateMap, 1000, bot);
            return;
        }

        bot.options.map_size += 2;
        var offset = 10 * ((bot.options.map_size - 1) / 2);

        if(!bot.options.map_loaded) {
            bot.options.map_loaded = {};
        }

        bot.eachCity(function updateMapEach(city) {
            var startX = city.x - offset;
            if(startX < 0) {
                startX = 750 + startX;
            }
            var startY = city.y - offset;
            if(startY < 0) {
                startY = 750 + startY;
            }

            for(var x = 0; x<bot.options.map_size; x++) {
                for(var y=0; y<bot.options.map_size; y++) {
                    var getX = (startX + (x * 10)) % 750;
                    var getY = (startY + (y * 10)) % 750;

                    if(!bot.options.map_loaded[getX]) {
                        bot.options.map_loaded[getX] = {};
                    }
                    if(bot.options.map_loaded[getX][getY]) {
                        bot.debugAttack("Not reloading (" + getX + "," + getY + ")");
                        continue;
                    }

                    bot.options.map_loaded[getX][getY] = true;
                    bot.debugAttack("Get map (" + getX + "," + getY + ")");
                    bot.sendSlowGetCommand("Get map (" + getX + "," + getY + ")",
                                            "map.json",
                                            "x=" + getX + "&y=" + getY,
                                            city);
                }
            }
        });

        bot.saveOptions();
    },
    findBestGang: function findBestGang(city, level) {
        this.trace();
        this.debugAttack("FindBestGang for " + city.type + " with lvl " + level);
        var d = new Date();
        var sel = {lvl: 0};
        var sel_dist = 1000;

        for(var keyX in this.options.map) {
            for(var keyY in this.options.map[keyX]) {
                var gang = this.options.map[keyX][keyY];
                if(gang.lvl != level && (level > 1 && gang.lvl != (level - 1))) {
                    this.debugAttack("Gang has wrong level (" + gang.lvl + " != " + level, city);
                    continue;
                }

                if(sel.lvl > gang.lvl) {
                    this.debugAttack("Selected gang is better (" + sel.lvl + " > " + gang.lvl + ")", city);
                    continue;
                }

                if(gang.attacked && gang.attacked >= d.getTime()) {
                    this.debugAttack("Gang already attacked", city);
                    continue;
                }

                var distX = Math.abs(keyX - city.x);
                if(distX > 250) {
                    distX = Math.abs(750 - distX);
                }
                var distY = Math.abs(keyY - city.y);
                if(distY > 250) {
                    distY = Math.abs(750 - distY);
                }


                if((distX + distY) > sel_dist && sel.lvl === gang.lvl) {
                    this.debugAttack("Selected gang is closer", city);
                    continue;
                }

                sel_dist = distX + distY;
                sel = gang;
                this.debugAttack("Found better Gang " + sel.lvl + " at (" + keyX + "," + keyY + ") with dist (" + distX + " + " + distY + ") = " + sel_dist, city);
            }
        }
        return sel;
    },
    doAttack: function doAttack() {
        this.trace();
        var t = 60000;
        var d = new Date();

        if(!this.options.map) {
            this.updateMap();
            return(10000);
        }

        if(!this.cities || !this.options.attackOrders) {
            this.debugAttack("City or orders not ready");
            return(10000);
        }

        this.eachCity(function doAttackEach(city) {
            if(city.energy <= 1) {
                this.debugAttack("No more energy", city);
                return;
            }

            if(city.type == "DoriaAirport") {
                this.debugAttack(city.type + " can't attack", city);
                return;
            }

            var bestOrder = {gang: 0};
            for(var i=0; i<this.options.attackOrders.length; i++) {
                var order = this.options.attackOrders[i];
                this.debugAttack("Order: " + order.gang + " City: " + order.city + " Units: " + order.units, city);


                if(order.city && order.city != 'all' && order.city != city.type) {
                    this.debugAttack("Wrong city (" + order.city + " != " + city.type + ")", city);
                    continue;
                }

                var doIt = true;
                var aUnits = JSON.parse(order.units);
                if(city.units) {
                    for(var u in aUnits) {
                        if(!city.units[u] || city.units[u] < aUnits[u]) {
                            this.debugAttack("Do not have " + u + " (" + aUnits[u] + ")", city);
                            doIt = false;
                            break;
                        }
                    }
                } else {
                    doIt = false;
                    this.debugAttack("Missing units in city", city);
                }

                if(doIt) {
                    var bestLvl = parseInt(bestOrder.gang, 10);
                    var lvl = parseInt(order.gang, 10);
                    if(bestLvl < lvl) {
                        bestOrder = order;
                    }
                }
            }

            if(!bestOrder.units) {
                return;
            }

            var attackGang = this.findBestGang(city, bestOrder.gang);
            if(attackGang.lvl === 0) {
                this.debugAttack("Failed to find a gang to attack", city);
                return;
            }

            this.debugAttack("Attack " + attackGang.lvl + " Gang at (" + attackGang.x + "," + attackGang.y + ")", city);
            if(attackGang.lvl <= 10) {
                attackGang.attacked = d.getTime() + (30 * 60 * 1000);
            }
            var units = bestOrder.units;
            if(bestOrder.use_all) {
                units = this.getAttackUnits(city);
            }
            this.attack(attackGang.x, attackGang.y, units, city);

            t = 600000;
            this.saveOptions();
        });

        return(t);
    },
    getAttackUnits: function getAttackUnits(city) {
        this.trace();
        if(city && city.units) {
            var units = this.clone(city.units);
            for(var def in this.defenseUnits) {
                if(units[def]) {
                    delete units[def];
                }
            }
            var total = 0;
            for(var unit in units) {
                if(total >= city.maximum_troops) {
                    delete units[unit];
                    continue;
                }

                if(units[unit] > (city.maximum_troops - total)) {
                    units[unit] = (city.maximum_troops - total);
                }
                this.debugAttack("Add attack units " + unit +  " => " + units[unit] + " (" + total + "/" + city.maximum_troops + ")",city);
                total += units[unit];
            }
            return JSON.stringify(units);
        }
        return "";
    },
    attack: function attack(x, y, units, city) {
        this.trace();
        this.sendCommand("Attack (" + x + "," + y + ") from " + city.type,
                         "cities/" + city.id + "/marches.json",
                         "_method=post&march[x]=" + x + "&march[y]=" + y + "&march[units]=" + units,
                         city);
        this.addStat("Attack", 1);
    }
};
module.exports = attackBot;
