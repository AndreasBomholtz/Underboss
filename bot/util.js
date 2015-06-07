var utilBot = {
    bind: function bind(method) {
        if(method) {
            var self = this;
            return(function(){return(method.apply(self, arguments));});
        }
    },
    signal: function signal(sig) {
        $(document).trigger(sig);
    },
    listen: function listen(sig,meth) {
        $(document).bind(sig,this.bind(meth));
    }
};
