var bondsBot = {
    this.doBonds = function doBonds() {
        this.debugBonds("Get Bonds");
        if(this.cities) {
            var city = this.cities[0];
            this.sendGetCommand("Get Bonds","bonds.json","action=index",city);
        }
    };
    this.handleBonds = function handleBonds() {
        this.debugBonds("Handle bonds");
        if(this.cities) {
            var city = this.cities[0];
            this.sendCommand("Collect Bonds","bonds/redeem.json","action=index",city);
        }
    };
};
