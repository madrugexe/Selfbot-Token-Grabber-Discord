const fs = require('fs');

class FloodDBManager {
    constructor(filePath = './flood.json') {
        this.filePath = filePath;
        this.data = this.loadDB();
    }

    loadDB() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(data);
            }
            console.log('📁 Creating new flood.json file');
            return {};
        } catch (err) {
            console.error('❌ Flood DB read error:', err);
            return {};
        }
    }

    saveDB() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
        } catch (err) {
            console.error('❌ Flood DB save error:', err);
        }
    }

    saveUserSequence(userId, sequence) {
        this.data[userId] = sequence;
        this.saveDB();
    }

    getUserSequence(userId) {
        return this.data[userId] || { messages: [], delays: [], isFlooding: false };
    }

    removeUserSequence(userId) {
        if (this.data[userId]) {
            delete this.data[userId];
            this.saveDB();
        }
    }

    getAllSequences() {
        return this.data;
    }
}

module.exports = FloodDBManager;