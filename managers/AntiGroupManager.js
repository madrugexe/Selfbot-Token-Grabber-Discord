const fs = require('fs');

class AntiGroupManager {
    constructor(filePath = './antigroup.json') {
        this.filePath = filePath;
        this.data = this.loadDB();
        this.activeHandlers = new Map();
    }

    loadDB() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(data);
            }
            console.log('📁 Creating new antigroup.json file');
            return {};
        } catch (err) {
            console.error('❌ AntiGroup DB read error:', err);
            return {};
        }
    }

    saveDB() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
        } catch (err) {
            console.error('❌ AntiGroup DB save error:', err);
        }
    }

    setAntiGroup(userId, status) {
        this.data[userId] = status;
        this.saveDB();
        return status ? '✅ Anti-Group enabled' : '🚫 Anti-Group disabled';
    }

    getAntiGroupStatus(userId) {
        return this.data[userId] || false;
    }

    removeAntiGroup(userId) {
        if (this.data[userId]) {
            delete this.data[userId];
            this.saveDB();
        }
    }

    getAllStatuses() {
        return this.data;
    }

    setupAntiGroupHandler(client, userId) {
        this.removeAntiGroupHandler(client, userId);

        if (this.getAntiGroupStatus(userId)) {
            const handler = async (channel) => {
                if (channel.type === 'GROUP_DM') {
                    try {
                        await channel.delete();
                    } catch (error) {
                        console.error("[ANTIGROUP] Close error:", error);
                    }
                }
            };

            client.on('channelCreate', handler);
            this.activeHandlers.set(userId, handler);
            console.log(`🔒 Anti-Group handler enabled for user ${userId}`);
        }
    }

    removeAntiGroupHandler(client, userId) {
        const handler = this.activeHandlers.get(userId);
        if (handler) {
            client.off('channelCreate', handler);
            this.activeHandlers.delete(userId);
            console.log(`🔓 Anti-Group handler disabled for user ${userId}`);
        }
    }
}

module.exports = AntiGroupManager;