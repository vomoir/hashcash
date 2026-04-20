self.importScripts('sha1.js');

self.onmessage = function(e) {
    var data = e.data;
    this.console.log(data);
    switch (data.cmd) {
        case 'start':
            self.postMessage('WORKER STARTED: ' + data.msg);
            break;
        case 'stop':
            self.postMessage('WORKER STOPPED: ' + data.msg +
                '. (buttons will no longer work)');
            self.close(); // Terminates the worker.
            break;
        case 'hash':
            var patternStr = "^0{" + data.zeros + "}";
            var salt = data.salt;
            console.log("patternStr = " + patternStr);
            //var pattern = new RegExp(/^0{3}/);
            var pattern = new RegExp(patternStr);

            var appliedHashes = 0;
            var encHash = sha1(data.hex_hash_key);
            var currTime = (new Date()).getTime();

            while (!encHash.match(pattern)) {
                salt = salt + 1;
                appliedHashes = appliedHashes + 1;

                var currTime = (new Date()).getTime();
                hex_hash_key = data.hex_hash_key;
                hex_hash_key = "2:" + data.ipAdd + ":" + currTime + ":" + salt;

                encHash = sha1(hex_hash_key);
                console.log("encHash = " + encHash);
                //console.log("appliedHashes = " + appliedHashes);
                if (appliedHashes < data.worklevel) {
                    self.postMessage({ salt: salt, address: hex_hash_key, hex_hash_key: encHash, appliedHashes: appliedHashes });
                    //self.postMessage('salt: ' + salt + "; hex_hash_key: " + encHash + "; Applied Hashes: " + appliedHashes);
                } else {
                    self.postMessage({ salt: salt, address: hex_hash_key, hex_hash_key: encHash, appliedHashes: appliedHashes });
                    //self.postMessage('salt: ' + salt + "; hex_hash_key: " + encHash + "; Applied Hashes: " + appliedHashes);
                }
            }
            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    }
}