var req = document.getElementById("request");
var get = document.getElementById("start");
var out = document.getElementById("output");

function echo(text){
    p = document.createElement("p");

    p.innerHTML = text;
    out.appendChild(p);
    out.appendChild(document.createElement("br"));
};

get.addEventListener("click", function(){
    var xhhtp = new XMLHttpRequest();
    xhhtp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var data = JSON.parse(this.response);

            var last    = data[0].histdata.value_raw;
            var current = 0;
            var chcount = 0;
            var upcount = 0;
            var docount = 0;

            var prep = "";
            for (i = 0; i < data.length; i++) {
                current = data[i].histdata.value_raw;
                if(current != 0){
                    if(current == 100){
                        if(last < 100){
                            docount = 1;
                            upcount = 0;
                            // start counting downtime
                            prep += "alert down; ";
                        }else{
                            docount++;
                            // counting downtime
                            prep += "server down; ";
                        }
                    }

                    if(last == 0){
                        chcount = 1
                        // start counting change in ping
                    }else if(last < 100){
                        chcount++;
                        // counting change in ping
                    }else{
                        chcount = 0;
                        if(chcount > 0){
                            // bad connection
                            prep += "bad connection; ";
                        }else if(chcount == 0){
                            // power down
                            prep += "power down; ";
                        }
                    }
                }else{
                    if(last != 0){
                        if(docount > 0){
                            upcount = 1;
                            docount = 0;
                            prep += "server up; ";
                        }else if(docount == 0){
                            upcount++;
                            prep += "server running; ";
                        }
                    }
                }

                echo(prep);
            }
        }     
    };

    xhhtp.open("GET", req.value, true);
    xhhtp.send();
});