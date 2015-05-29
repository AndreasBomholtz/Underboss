var bailoutBot = {
    doBailout: function doBailout() {
        this.trace();
        if(this.cities) {
            for(var c=0; c<this.cities.length; c++) {
                var city = this.cities[c];
                if(city.type != "DoriaAirport") {
                    this.sendGetCommand("Update bail","cities/"+city.id+"/cash_jail.json","",city);
                }
            }
        }
    },
	payBailout: function payBailout(city) {
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
                        var count = parseInt((cash-total_cost) / cost,10);
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
    }
};
