var prizeBot = function() {
    this.getPrize = function getPrize() {
        this.trace();
        if(this.cities && this.cities[0] && this.minigame_timestamp) {
            this.debugPrize("Get Prize");
            this.sendCommand("Get Prize","minigames/save_result.json","minigame_timestamp="+this.minigame_timestamp,this.cities[0]);
            this.addStat("Prize",1);
        }
    };
    this.doPrize = function doPrize() {
        this.trace();
        if(this.cities && this.cities[0]) {
            if(this.free_ticket || (this.items && this.items.DailyChance && this.items.DailyChance > 0)) {
                this.debugPrize("Update Prize");
                this.sendGetCommand("Update Prize","minigames/index.json","",this.cities[0],this.bind(this.updatePrizeList));
            } else {
                this.debugPrize("No prize ticket - Update player data");
                this.loadPlayerData();
                return(5*60000);
            }
        } else {
            this.debugPrize("Cities not ready");
        }
        return(0);
    };
};
