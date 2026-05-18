// Reuse the user's sha1 implementation or a similar one
// For simplicity in this demo, I'll include a basic sha1 here or assume it's imported
importScripts('sha1.js'); 

self.onmessage = function(e) {
    const { cmd, salt, hex_hash_key, zeros, ipAdd, worklevel } = e.data;

    if (cmd === 'hash') {
        const patternStr = "^0{" + zeros + "}";
        const pattern = new RegExp(patternStr);

        let currentSalt = salt;
        let appliedHashes = 0;
        let encHash = sha1(hex_hash_key);
        const startTime = Date.now();

        while (!encHash.match(pattern)) {
            currentSalt++;
            appliedHashes++;

            const currTime = Date.now();
            const newKey = `2:${ipAdd}:${currTime}:${currentSalt}`;
            encHash = sha1(newKey);

            // Periodically report progress if needed, but for teaching, we mostly care about the end result or specific thresholds
            if (appliedHashes % 100 === 0) {
                self.postMessage({ 
                    status: 'progress', 
                    appliedHashes, 
                    currentHash: encHash 
                });
            }
        }

        self.postMessage({ 
            status: 'success', 
            salt: currentSalt, 
            hash: encHash, 
            appliedHashes,
            timeTaken: (Date.now() - startTime) / 1000
        });
    }
};
