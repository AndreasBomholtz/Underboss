var itemBot = {
    doItems: function doItems() {
        if(this.items) {
            if(this.cities) {
                var city = this.cities[0];
                for(var i=0; i<collect.length; i++) {
                    if(this.items[collect[i]]) {
                        this.debugItems(collect[i]+": "+this.items[collect[i]]);
                        this.items[collect[i]]--;
                        this.sendCommand("Collect "+collect[i],
										 "player_items/"+collect[i]+".json",
										 "_method=delete",
										 city);
                        this.addStat("Item",1);
                        //return(1000);
                    }
                }
                this.loadPlayerData();
            } else {
                this.debugItems("Cities is not ready");
            }
        } else {
            this.debugItems("Items is not ready");
        }
    }
};
