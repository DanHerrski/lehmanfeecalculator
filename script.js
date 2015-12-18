function calc(){
    var textType = Node.textContent ? 'textContent' : 'innerText';
    var ebitda = parseFloat(document.getElementById('ebitda').value) || 0;
    var mult = parseFloat(document.getElementById('mult').value) || 0;
    var leh = [0.05, 0.04, 0.03, 0.02, 0.01];
    var fee = document.getElementById("fee");
    var totalEnt = document.getElementById("tev");
    var TEV = ebitda * mult;

    
    //Display TEV
    totalEnt[textType] = Math.round(TEV*1000)/1000;//this x100/divid by 100 is to round it to 3 decimals
    
    
    // New loop calculator. Should increment by one through the 1-5 steps
    /*looper not working
    
    var makeFee = 0;
    for (i=0; i < TEV+1; i++){
        if (i>=4){
            j=4;
            } else {j=i;};
        makeFee += Math.max(leh[j]*(TEV-i),0);
    }
    fee[textType] = numberWithCommas(Math.max(makeFee,0);
    */
    
    
    
    //2nd Interation - each calc'd with if statement then added together
    /*
    var feeMaker = [0,0,0,0,0];
    if(TEV>=1){
            fee[0] = 1 * leh[0];
        }else{
            fee[0] = Math.max(TEV,0)*leh[0];
        };
    
    makeFee = feeMaker[0] + feeMaker[1] + feeMaker[2] + feeMaker[3] + feeMaker[4];
    fee[textType] = numberWithCommas(Math.max(makeFee,0);
    */

    
    
    //1st Interation
    
    if(TEV<1){fee[textType] = numberWithCommas(Math.max(leh[0]*TEV,0))} else
    if(TEV>=1 && TEV<2){fee[textType] = numberWithCommas(leh[1]*(TEV-1) + 0.05)} else
    if(TEV>=2 && TEV<3){fee[textType] = numberWithCommas(leh[2]*(TEV-2) + 0.09)} else
    if(TEV>=3 && TEV<4){fee[textType] = numberWithCommas(leh[3]*(TEV-3) + 0.12)} else
    if(TEV>=4){fee[textType] = numberWithCommas(leh[4]*(TEV-4) + 0.14)};
    



    
    /* This works with other HTML
    var totalEnt = parseFloat(document.getElementById("tev").value);
    var fee = 0;

    fee = totalEnt * 5;
    
    result = document.getElementById("result");
    result.innerHTML = fee;
    */
}
calc();

function numberWithCommas(x) {
    var lehOpt = document.getElementById("lehman");
    var sD = parseFloat(lehOpt.selectedIndex)+1;

    var y = Math.round(x * 1000000 * sD *100)/100; //the x100/round/div by 100 is to limit to two decimal places
    var parts = y.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}