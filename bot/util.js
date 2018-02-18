var utilBot = {
    bind: function bind(method) {
        var self = this;
        return(function binded(){
            return(method.apply(self, arguments));
        });
    },
    handlers: {},
    signal: function signal(sig, args) {
        if(!this.handlers[sig]) {
            return;
        }

        for(var i=0; i<this.handlers[sig].length; i++) {
            if(args === undefined) {
                this.handlers[sig][i].call(this);
            } else {
                this.handlers[sig][i].call(this, args);
            }
        }
/*
            if(args === undefined) {
                $(window.document).trigger(sig);
            } else {
                $(window.document).trigger(sig, args);
            }
*/
    },
    listen: function listen(sig, meth) {
        if(!this.handlers[sig]) {
            this.handlers[sig] = [];
        }

        this.handlers[sig].push(meth);

        //$(window.document).bind(sig, this.bind(meth));
    },
    numberToString: function numberToString(num) {
        num = parseInt(num, 10);
        if(num >= 1000000000) {
            num = Math.floor(num / 100000000);
            num /= 10;
            num += " B";
        } else if(num >= 1000000) {
            num = Math.floor(num / 100000);
            num /= 10;
            num += " M";
        } else if(num >= 1000) {
            num = Math.floor(num / 100);
            num /= 10;
            num += " K";
        }
        return num;
    },
    eachCity: function eachCity(func) {
        if(!this.cities) {
            return;
        }

        for(var i=0; i<this.cities.length; i++) {
            if(this.cities[i] && this.cities[i].id) {
                func.call(this, this.cities[i]);
            }
        }
    },
    eachNeighborhood: function eachNeighborhood(func, only_city) {
        var lFunc = function lFunc(city) {
            if(city.neighborhood && city.neighborhood.length) {
                for(var i=0; i<city.neighborhood.length; i++) {
                    var neighborhood = city.neighborhood[i];
                    if(neighborhood) {
                        func.call(this, city, neighborhood);
                    }
                }
            }
        };

        if(only_city === undefined) {
            this.eachCity(lFunc);
        } else {
            lFunc(only_city);
        }
    },
    clone: function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};
module.exports = utilBot;
