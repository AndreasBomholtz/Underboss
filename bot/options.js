var optionsBot = {
    saveOptions: function saveOptions() {
        localStorage.setItem("gfb_options",JSON.stringify(this.options));
    },
    loadOptions: function loadOptions() {
        var value = localStorage.getItem("gfb_options");
        if(value) {
            this.options = JSON.parse(value);
        } else {
            this.options = {};
        }

        if(!this.options.attackOrders) {
            var order = {};
            order.gang = 10;
            order.units = "";
            order.city = "all";
            order.use_all = true;

            //this.options.attackOrders
        }
    }
};
module.exports = optionsBot;
