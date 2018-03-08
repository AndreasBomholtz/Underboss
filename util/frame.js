//Change ifame size, so that the bot panel can be there
var frame = document.getElementById("game_frame");
if(frame)
{
    $(frame).width((980 + 501) + "px");

    //Force page to reload to try to counter the ban
    setTimeout(function() {
        location.reload();
    }, 2*60*60*1000);
}

function setup_facebook() {
    var a = document.getElementById("iframe_canvas");
    if (a) {
        for (a.style.width = "100%"; (a = a.parentNode) !== null;) {
            if (a.tagName == "DIV") {
                a.style.width = "100%";
            }
        }
        $("rightCol").style.display = "none";
    } else {
        setTimeout(setup_facebook, 1000);
    }
}

if (document.URL.search(/apps.facebook.com\/play_godfather/i) >= 0) {
    setup_facebook();
}
