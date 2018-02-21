var ajaxBot = {
    ajax_send: function ajax_send(url, sucess, error, method, data, async) {
        if (async === undefined) {
            async = true;
        }
        var self = this;
        var x = new XMLHttpRequest();
        if(method == 'GET') {
            url += "?" + data;
        }
        x.open(method, url, async);
        x.onreadystatechange = function onreadystatechange() {
            if (x.readyState == 4) {
                if(x.status == 200) {
                    sucess.call(self, x.responseText);
                } else {
                    error.call(self, x.status, x.responseText);
                }
            }
        };
        if (method == 'POST') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data);
    }
};
