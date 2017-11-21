//var req = document.getElementById("request");
var get = document.getElementById("start");
var out = document.getElementById("output");

function echo(text){
    p = document.createElement("p");

    p.innerHTML = text;
    out.appendChild(p);
};

function ajaxJSON(APILOC){
    var xhhtp = new XMLHttpRequest();
    var toChart = [];
    var ping = [];

    xhhtp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var data = JSON.parse(this.response);
            console.debug(data);

            var last = {
                value: data.histdata[0].value_raw,
                change: 0,
                uptime: 0,
                lastup: 0,
                down: 0,
                waver: false,
                status: "start"
            };
            
            for (i = 0; i < data.histdata.length; i++) {
                var current = {
                    value: data.histdata[i].value_raw,
                    change: last.change,
                    uptime: last.uptime,
                    lastup: last.lastup,
                    down: last.down,
                    waver: last.waver,
                    status: last.status
                };
                
                tanggalnya = new Date((data.histdata[i].datetime_raw - 25569) * 86400 * 1000);
                var prep = tanggalnya.toLocaleString() + "; " + current.value + "; ";

                if(current.value != last.value){
                    if(Math.abs(current.value - last.value) < 50){
                        current.change++;
                    }else if(Math.abs(current.value - last.value) > 50){
                        current.change--;
                    }

                    if((current.value - last.value) < 0){
                        current.waver = true;
                    }
                }else{
                    if(current.value == 0 || current.value == 100){
                        current.change = 0;
                        current.waver = false;
                    }
                }

                if(current.value == 100){
                    if(current.down != 0){
                        // currently on down
                        prep += "server down; ";
                    }else{
                        // down starting
                        current.lastup = current.uptime;
                        current.uptime = 0;
                        if(current.change > 1){
                            // bad connection
                            current.status = "bad";
                            prep += "bad connection; ";
                        }else if(current.change < 2 && current.waver){
                            // connection wavering (bad)
                            current.status = "bad";
                            prep += "connection waver; ";
                        }else{
                            // server down
                            current.status = "down";
                            prep += "power down; ";
                        }
                    }

                    current.down++;
                }else{
                    current.uptime++;
                    if(current.down > 0){
                        if(current.status == "down"){
                            // server up again
                            current.uptime = 0;
                            current.down   = 0;
                            current.change = 0;
                            prep += "server up; ";
                        }else if(current.status == "bad"){
                            current.uptime = current.lastup;
                        }
                    }

                    current.status = "up";
                }

                // if(i < 1){
                //     current.uptime = 0;
                //     current.status = "start";
                // }

                prep += "ch: "+current.change+"; up: "+current.uptime+"; lastup: "+current.lastup+"; down: "+current.down+"; status: "+current.status;
                echo(prep);
                toChart.push({
                    date: tanggalnya,
                    uptime: current.uptime
                });

                last = current;
            }

            console.debug(toChart);

            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "dark",
                "marginRight": 80,
                "dataProvider": toChart,
                "valueAxes": [{
                    "position": "left",
                    "title": "Uptime"
                }],
                "graphs": [{
                    "id": "g1",
                    "fillAlphas": 0.4,
                    "valueField": "uptime",
                    "balloonText": "<div style='margin:5px; font-size:19px;'>Uptime:<b>[[value]]</b></div>"
                }],
                "chartCursor": {
                    "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                    "cursorPosition": "mouse"
                },
                "categoryField": "date",
                "categoryAxis": {
                    "minPeriod": "mm",
                    "parseDates": true
                }
            });
        }     
    };

    xhhtp.open("GET", APILOC, true);
    xhhtp.send();
}

chart.addListener("dataUpdated", zoomChart);
    // when we apply theme, the dataUpdated event is fired even before we add listener, so
    // we need to call zoomChart here
    zoomChart();
    // this method is called when chart is first inited as we listen for "dataUpdated" event
    function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart.zoomToIndexes(chartData.length - 250, chartData.length - 100);
}

// generate some random data, quite different range
function generateChartData() {
    var chartData = [];
    // current date
    var firstDate = new Date();
    // now set 500 minutes back
    firstDate.setMinutes(firstDate.getDate() - 1000);

    // and generate 500 data items
    var visits = 500;
    for (var i = 0; i < 10; i++) {
        var newDate = new Date(firstDate);
        // each time we add one minute
        newDate.setMinutes(newDate.getMinutes() + i);
        // some random number
        visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
        // add data item to the array
        chartData.push({
            date: newDate,
            visits: visits
        });
    }
    return chartData;
}