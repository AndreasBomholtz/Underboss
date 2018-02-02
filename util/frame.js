//Change ifame size, so that the bot panel can be there
if($ && $("#game_frame"))
{
    $("#game_frame").width((980 + 301) + "px");

    //Force page to reload to try to counter the ban
    setTimeout(function() {
        location.reload();
    }, 2*60*60*1000);
}
