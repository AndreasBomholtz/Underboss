var reportBot = {
    doReport: function doReport() {
        this.debugReport("Do Reports");
        this.sendGetCommand("Reports","reports.json","count=18&page=1&category=reports");
    },
    handleReport: function handleReport() {
        this.debugReport("Handle Reports");
        if(!this.reports || !this.reports.reports) {
            return;
        }
        var ids = "";
        for(var i=0; i<this.reports.reports.length; i++) {
            var r = this.reports.reports[i];
            if(r.battle_side == "attacking" && r.battle_result == "Won" && r.read_at === null) {
                ids += r.id+"|";
            }
        }
        this.debugReport("Ids: "+ids);
        if(ids !== "") {
            this.sendCommand("Delete reports","reports/bulk_delete.json","_method=delete&ids="+ids);
        }
    }
};
module.exports = reportBot;
