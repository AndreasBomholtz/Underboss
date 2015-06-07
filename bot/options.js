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
    }
};
