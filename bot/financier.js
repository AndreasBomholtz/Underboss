var financierBot = {
    doFinancier: function doFinancier() {
        this.debugFinancier("Get Financier Office");
        if(this.cities) {
            for(var i=0; i<this.cities.length; i++) {
                var city = this.cities[i];
                if(city.type === "Queens") {
                    this.sendGetCommand("Get Financier Office", "financiers_office/show.json", "", city);
                    return 10*60*1000;
                }
            }
            this.debugFinancier("Failed to find Queens");
        }
    },
    handleFinancier: function handleFinancier() {
        if(this.financier_trades > 0 && this.options.financier_order) {
            for(var i=0; i<this.options.financier_order.length; i++) {
                var item = this.options.financier_order[i];
                if(this.my_items[item]) {
                    this.debugFinancier("Selling "+item+" because there is "+this.my_items[item]);
                    this.sellFinancierItem(item);
                    return;
                }
            }
            this.debugFinancier("Failed to find an item to sell");
        } else {
            this.debugFinancier("Missing Financier trades or Financier orders");
        }
    },
    sellFinancierItem: function handleFinancier(item) {
        this.debugFinancier("Handle Financier Office");
        if(this.cities) {
            for(var i=0; i<this.cities.length; i++) {
                var city = this.cities[i];
                if(city.type === "Queens") {
                    this.debugFinancier("Sell Financier Item: " + item, city);
                    this.financier_trades -= 1;
                    this.my_items[item] -= 1;
                    this.addStat("Financier", 1);
                    this.sendCommand("Sell Financier Item: " + item, "financiers_office/exchange.json", "item="+item, city);
                    return;
                }
            }
            this.debugFinancier("Failed to find Queens");
        }
    }
};
module.exports = financierBot;
