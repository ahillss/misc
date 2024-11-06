

// https://stackoverflow.com/questions/48874382/how-to-unsubscribe-from-all-the-youtube-channels-at-once

// https://www.youtube.com/feed/channels 


(function() {
    function next() {
        setTimeout(function () { 
            var e = document.querySelector("ytd-channel-renderer");  
            e.parentNode.removeChild(e); 
            setTimeout(run,1000);
        },1000);
    }
    
    function method1(from_ind,to_ind) {
        var belldropdown_button=document.querySelector('div#grid-container').querySelector('ytd-channel-renderer').querySelectorAll('button')[1];
        var notifications=['all notifications','personalized notifications','no notifications'];
        
        if(belldropdown_button.getAttribute("aria-label").search(notifications[from_ind]) != -1) {
            belldropdown_button.click();
            
            setTimeout(function () { 
                var belldropdown_menu = document.querySelector('tp-yt-iron-dropdown');
                var belldropdown_items = belldropdown_menu.querySelectorAll('ytd-menu-service-item-renderer');
        
                belldropdown_items[to_ind].click();
                next();
            },1000);
        } else {
            next();
        }
    }
        
    function run() {
        // 0=all 1=personalised 2=none 3=unsubscribe
        var from_ind=0;
        var to_ind=1;
        
        method1(from_ind,to_ind);
    }
    
    run();
})();

