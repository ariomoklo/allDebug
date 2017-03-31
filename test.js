$('#fs').change(function(){
    fs = $(this).val();
    $('.fs').html(fs);
    
    k = $('#k').val();
    kips = $('#kips').val();
    vp = $('#vp').val();
    
    calcIn(fs, k, kips, vp);
});

$('#k').change(function(){
    k = $(this).val();
    if(k != 'null'){
        $('.k').html(k);
        
        fs = $('#fs').val();
        kips = $('#kips').val();
        vp = $('#vp').val();
        calcIn(fs, k, kips, vp);
    }else{
        $('.k').html('-'); 
    } 
});

$('#kips').change(function(){
    kips = $(this).val();
    if(k != 'null'){
        $('.kips').html(kips);  
        
        fs = $('#fs').val();
        k = $('#k').val();
        vp = $('#vp').val();
        calcIn(fs, k, kips, vp);
    }else{
        $('.kips').html('-'); 
    }
});

$('#vp').change(function(){
    vp = $(this).val();
    if(k != 'null'){
        $('.vp').html(vp+'.000');
        
        fs = $('#fs').val();
        kips = $('#kips').val();
        k = $('#k').val();
        calcIn(fs, k, kips, vp);
    }else{
        $('.vp').html('-'); 
    }
});

function calcK(k, x){
    switch(k) {
        case "25":
            return (-0.000009*Math.pow(x, 3))+(0.0367*Math.pow(x, 2))-(51.862*x)+31820;
            break;
        case "50":
            return (-0.000006*Math.pow(x, 3))+(0.0284*Math.pow(x, 2))-(44.468*x)+28763;
            break;
        case "100":
            return (-0.000009*Math.pow(x, 3))+(0.0364*Math.pow(x, 2))-(50.996*x)+29253;
            break;
        case "200":
            return (-0.00005*Math.pow(x, 3))+(0.0411*Math.pow(x, 2))-(53.471*x)+28341;
            break;
        case "300":
            return (-0.000008*Math.pow(x, 3))+(0.0335*Math.pow(x, 2))-(46.638*x)+25043;
            break;
        case "400":
            return (-0.000008*Math.pow(x, 3))+(0.0318*Math.pow(x, 2))-(44.162*x)+23052;
            break;
        case "500":
            return (-0.000009*Math.pow(x, 3))+(0.0334*Math.pow(x, 2))-(44.798*x)+21933;
            break;
        default:
            return 0;
    } 
}

function calcKips(kips, y){
    switch(kips){
        case "25":
            return (y+13268)/48.336;
            break;
        case "50":
            return (y+11249)/32.445;
            break;
        case "75":
            return (y+10284)/25.523;
            break;
        case "100":
            return (y+8013.5)/19.055;
            break;
        case "120":
            return (y+7878.5)/17.037;
            break;
        default:
            return 0;
    }
}

function calcVp(vp, x){
    switch(vp){
        case "10":
            return (20.283*x)+9449.7;
            break;
        case "50":
            return (22.591*x)+8725.5;
            break;
        case "100":
            return (23.319*x)+8702.8;
            break;
        case "500":
            return (24.735*x)+8524;
            break;
        case "1.000":
            return (25.104*x)+8741.7;
            break;
        case "5.000":
            return (28.015*x)+7570.9;
            break;
        default:
            return 0;
    }
}

function calcIn(fs, k, kips, vp){
    var a = calcK(k, fs);
    var b = calcKips(kips, a);
    var c = calcVp(vp, b);
    
    if(c != 0){
        $('.in').html(c);
    }
}
    