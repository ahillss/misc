javascript:void((()=>{
    function move_items(fromInds,toInd){
        if(fromInds.length==0 || toInd==0){
            return;
        }
    
        for(var i=0;i<fromInds.length;i++){
            toInd=(fromInds[i]<toInd)?toInd-1:toInd;
            g_Wishlist.MoveToPosition(g_Wishlist.rgVisibleApps[fromInds[i]-1],toInd-1+i);
            console.log(fromInds[i] + "=>" + toInd);
        }

        g_Wishlist.Update(true);
        g_Wishlist.SaveOrder();
    }
    
    function get_froms() {
        var inputFrom=prompt('from (eg 2;3;5-7;9)').replace(/\s/g, '').split(';');    
        var fromInds=[];
        
        for (var i=0;i<inputFrom.length;i++) {
            if(inputFrom[i].match(/^[0-9]+$/)) {
                fromInds.push(parseInt(inputFrom[i]));
            } else {
                var m = inputFrom[i].match(/([0-9]+)[-]([0-9]+)/);
                
                if(m) {
                    var a = parseInt(m[1]);
                    var b = parseInt(m[2]);
                    
                    for(var j=a;j<=b;j++) {
                        fromInds.push(j);
                    }
                }
            }
        }
        
        fromInds.sort();        
        fromInds.filter(x => (x<=0 || x >g_Wishlist.rgVisibleApps.length));
        return fromInds;
    }
    
    function get_to() {
        var inputTo=prompt('to (eg 0 for top, 1 for after top, -1 for last, -2 for second last, etc)','0').replace(/\s/g, '');
        var toInd=parseInt(inputTo);
        toInd=(toInd<0)?(g_Wishlist.rgVisibleApps.length+toInd+1+1):(toInd+1);
        return toInd;
    }
    
    var fromInds=get_froms();
    var toInd=get_to();
    move_items(fromInds,toInd);
})());