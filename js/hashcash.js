/* Filename: hashcash.js */
let currIp = "192.168.1.1";
https: //api.ipify.org/?format=json
    $(document).ready(function() {
        $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
            function(json) {
                //document.write("My public IP address is: ", json.ip);
                currIp = json.ip;
            }
        );
        const learnMore = document.querySelector("#learn_more");

        learnMore.addEventListener("click", () => {
            //doesn't work as yet. Trying to kick off the onboarding process.
            introJs().refresh();
        });

        $('#loader').hide();
        //initialise text and steps for the onboarding process
        introJs().setOptions({
            showButtons: true,
            showStepNumbers: true,
            steps: [{
                    title: 'The Very Simple Pretend Miner',
                    intro: 'Welcome to the VSPM! 👋. <br/><br/> Press ESC to end the tour.'
                },
                {
                    title: 'Level of Work!',
                    element: document.querySelector('.level_of_work'),
                    intro: 'The level of work determines whether your mining efforts get included. If you do not exceed the work level, your transaction is not added to the block.'
                },
                {
                    title: 'Number of Zeros',
                    element: document.querySelector('.number_of_zeros'),
                    intro: 'This is the mathematical puzzle you have to pass. Your hash value needs to have this many zeros preceding it. In bitcoin mining, the hash has to have about 14 leading zeros!! If you try to find more than 4 zeros, you\'ll hang up your computer.' +
                        '<br/>If the number of leading zeros isn\'t found, the block keep getting hashed over and over until it does.'
                },
                {
                    title: 'The Nonce',
                    element: document.querySelector(".nonce_info"),
                    intro: 'A nonce is an abbreviation for "number only used once," which is a number added to a hashed—or encrypted—block in a blockchain that, when rehashed, meets the difficulty level restrictions.'
                },
                {
                    title: 'The Hash',
                    element: document.querySelector('.hash_info'),
                    intro: 'This is the hashed value of the transaction as well as the nonce.' +
                        'The hash has to have the specified number of zeros as well as meet the level of work for it to be added to the chain.'
                }
            ]
        }).start();
    });

function hashStamp(salt, hex_hash_key, zeros, ipAdd, worklevel, startPerformance) {
    var patternStr = "^0{" + zeros + "}";

    var pattern = new RegExp(patternStr);

    var appliedHashes = 0;
    var encHash = sha1(hex_hash_key);
    //setTimeout(function() {
    while (!encHash.match(pattern)) {
        salt = salt + 1;
        appliedHashes = appliedHashes + 1;
        $("#nonce").val(salt);
        var currTime = (new Date()).getTime();
        hex_hash_key = "2:" + ipAdd + ":" + currTime + ":" + salt;
        encHash = sha1(hex_hash_key);
        $("#work_level_applied").val(appliedHashes);
        $("#hashvalue").val(hex_hash_key);
        $("#sha1value").val(encHash);
        var endPerformance = performance.now();
        var timeTaken = endPerformance - startPerformance;
        timeTaken = Math.floor(timeTaken / 1000);
        if (timeTaken < 1) {
            $("#time_taken").val(Math.floor(endPerformance - startPerformance) / 1000 + " seconds");
        } else {
            $("#time_taken").val(timeTaken + " seconds");
        }
    if (appliedHashes < worklevel) {
            $('#work_level_applied').css('background-color', 'red');
            $("#result").innerHTML = "Insufficient work. Transaction not added to the block :(";
            document.getElementById('result').textContent = encHash;
            $("#message").text = "Insufficient work. Transaction not added to the block :(";
        } else {
            $("#work_level_applied").css('background-color', 'aqua');
            $("#result").innerHTML = "Work sufficient. Transaction added to the block :)";
            document.getElementById('result').textContent = encHash;
            $("#message").text = "Work sufficient. Transaction added to the block :)";
        }
    }
    //},0);

    return salt;
}
var iRun = 0;

function find_salt() {
    $("#work_level_applied").val("");
    $("#hashvalue").val("");
    $("#sha1value").val("");
    
    $(".loader_div").hide();        
    var useWebWorker = jQuery('.switch-input').is(':checked') ? true: false;

    var startPerformance = performance.now();    

    var salt = Math.floor(Math.random() * 800) + 100;
    $("#nonce").val(salt);
    var zeros = $("#zeros").val();
    var ipAdd = "";
    if (currIp.indexOf(",") > -1) {
        ipAdd = currIp.split(",")[1];
        while (ipAdd.charAt(0) === ' ') {
            ipAdd = ipAdd.substring(1);
        }
    } else {
        ipAdd = currIp;
    }
    var worklevel = $("#level").val();
    var currTime = (new Date()).getTime();
    var hex_hash_key = "2:" + ipAdd + ":" + currTime + ":" + salt;
    $("#hashvalue").val(hex_hash_key);

    if(useWebWorker){
        //Include the web worker code that does the heavy lifting..
        var worker = new Worker('./js/dowork2.js');
        //send through the relevant data to the web worker
        worker.postMessage({ 'cmd': 'hash', 'salt': salt, 'hex_hash_key': hex_hash_key, 'zeros': zeros, 'ipAdd': ipAdd, 'worklevel': worklevel })
            //now we wait for the web worker to do it's stuff 
        worker.addEventListener('message', function(e) {            
            var data = e.data;
            //Worker returns ({ salt: salt, address: hex_hash_key, hex_hash_key: encHash, appliedHashes: appliedHashes });
            //console.log(data.hex_hash_key);
            document.getElementById('result').textContent = data.hex_hash_key;
            $("#sha1value").val(data.hex_hash_key);
            $("#times_run").val(data.appliedHashes);
            $("#work_level_applied").val(data.appliedHashes);

            var endPerformance = performance.now();
            var timeTaken = endPerformance - startPerformance;
            timeTaken = Math.floor(timeTaken / 1000);
            if (timeTaken < 1) {
                $("#time_taken").val(Math.floor(endPerformance - startPerformance) / 1000 + " seconds");
            } else {
                $("#time_taken").val(timeTaken + " seconds");
            }
            if (data.appliedHashes < worklevel) {
                $('#work_level_applied').css('background-color', 'red');
                $("#result").innerHTML = "Insufficient work. Transaction not added to the block :(";
                $("#message").text = "Insufficient work. Transaction not added to the block :(";
            } else {
                $("#work_level_applied").css('background-color', 'aqua');
                $("#result").innerHTML = "Work sufficient. Transaction added to the block :)";
                $("#message").text = "Work sufficient. Transaction added to the block :)";
            }
            //worker.postMessage({ 'cmd': 'stop' });
        }, false);
    } else {      
          
        $("#loader_div").show();        
        
        let data = { 'cmd': 'hash', 'salt': salt, 'hex_hash_key': hex_hash_key, 'zeros': zeros, 'ipAdd': ipAdd, 'worklevel': worklevel, 'appliedHashes' : 1, stop: false };        
        hashStamp(salt, hex_hash_key, zeros, ipAdd, worklevel, startPerformance);

        $("#loader_div").hide();        
    }
}

function resetTimesRun() {
    iRun = 0;
}