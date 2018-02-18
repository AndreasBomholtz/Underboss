var itemBot = {
    doItems: function doItems() {
        this.doItemsEvent();
    },
    doItemsEvent: function doItemsEvent() {
        if(!this.my_items) {
            this.debugItems("Items is not ready");
            return;
        }

        if(!this.cities) {
            this.debugItems("Cities is not ready");
            return;
        }

        var city = this.cities[0];
        for(var item in this.items) {
            if(this.items[item].autoCollect && this.my_items[item]) {
                this.debugItems(item+": "+this.my_items[item]);
                this.my_items[item]--;
                this.sendCommand("Use "+item,
                                 "player_items/"+item+".json",
                                 "_method=delete",
                                 city);
                this.addStat("Item",1);
            } else {
                this.debugItems("Can't find "+item+" in items",city);
            }
        }
    }
};
module.exports = itemBot;
