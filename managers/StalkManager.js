const fs = require('fs');
const path = require('path');

class StalkManager {
    constructor(filePath = './stalk-data.json') {
        this.filePath = filePath;
        this.data = this.loadDB();
        this.isStalking = this.data.activeStalk !== null;
        this.targetId = this.data.activeStalk ? this.data.activeStalk.userId : null;
    }

    loadDB() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(data);
            }
            // ✅ INITIALISER stalkHistory si le fichier n'existe pas
            const defaultData = {
                activeStalk: null,
                stalkHistory: {},
                userData: {}
            };
            this.saveDB(defaultData);
            return defaultData;
        } catch (err) {
            console.error('❌ Stalk DB read error:', err);
            // ✅ TOUJOURS retourner un objet avec stalkHistory
            return {
                activeStalk: null,
                stalkHistory: {},
                userData: {}
            };
        }
    }

    saveDB(data = null) {
        try {
            const dataToSave = data || this.data;
            fs.writeFileSync(this.filePath, JSON.stringify(dataToSave, null, 2));
        } catch (err) {
            console.error('❌ Stalk DB save error:', err);
        }
    }

    startStalk(userId, userTag) {
        console.log(`🔍 Starting stalk for ${userTag} (${userId})`);
        
        this.isStalking = true;
        this.targetId = userId;
        
        this.data.activeStalk = {
            userId: userId,
            userTag: userTag,
            startTime: new Date().toISOString(),
            messageCount: 0,
            messages: [],
            servers: [],
            locations: [],
            attachmentTypes: []
        };

        // ✅ CORRECTION : S'assurer que stalkHistory existe
        if (!this.data.stalkHistory) {
            this.data.stalkHistory = {};
        }

        if (!this.data.stalkHistory[userId]) {
            this.data.stalkHistory[userId] = {
                totalMessages: 0,
                lastStalked: new Date().toISOString(),
                locations: [],
                servers: [],
                attachmentCount: 0
            };
        }

        this.saveDB();
        return `🔍 Now stalking **${userTag}**`;
    }

    stopStalk() {
        if (!this.isStalking) return "⚠️ No active stalk to stop!";

        const targetTag = this.data.activeStalk.userTag;
        this.isStalking = false;
        this.targetId = null;
        this.data.activeStalk = null;
        
        this.saveDB();
        return `✋ Stopped stalking **${targetTag}**`;
    }

    addStalkedMessage(message) {
        if (!this.isStalking || !this.data.activeStalk) return;

        const locationInfo = this.getLocationInfo(message);
        const timestamp = new Date().toLocaleTimeString('fr-FR');
        
        const attachments = [];
        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                attachments.push({
                    url: attachment.url,
                    name: attachment.name,
                    contentType: attachment.contentType
                });
            });
        }

        const stalkEntry = {
            id: Date.now() + Math.random(),
            timestamp: timestamp,
            content: message.content,
            location: locationInfo,
            attachments: attachments
        };

        // Ajouter au stalk actuel
        this.data.activeStalk.messages.push(stalkEntry);
        this.data.activeStalk.messageCount++;

        // Mettre à jour les statistiques
        if (message.guild && !this.data.activeStalk.servers.includes(message.guild.name)) {
            this.data.activeStalk.servers.push(message.guild.name);
        }
        if (!this.data.activeStalk.locations.includes(locationInfo)) {
            this.data.activeStalk.locations.push(locationInfo);
        }

        // ✅ CORRECTION : S'assurer que stalkHistory existe pour les updates
        if (!this.data.stalkHistory) {
            this.data.stalkHistory = {};
        }

        const userId = this.targetId;
        if (!this.data.stalkHistory[userId]) {
            this.data.stalkHistory[userId] = {
                totalMessages: 0,
                lastStalked: new Date().toISOString(),
                locations: [],
                servers: [],
                attachmentCount: 0
            };
        }

        this.data.stalkHistory[userId].totalMessages++;
        this.data.stalkHistory[userId].lastStalked = new Date().toISOString();
        this.data.stalkHistory[userId].attachmentCount += attachments.length;
        
        if (!this.data.stalkHistory[userId].locations.includes(locationInfo)) {
            this.data.stalkHistory[userId].locations.push(locationInfo);
        }

        if (message.guild && !this.data.stalkHistory[userId].servers.includes(message.guild.name)) {
            this.data.stalkHistory[userId].servers.push(message.guild.name);
        }

        // Limiter à 100 messages maximum
        if (this.data.activeStalk.messages.length > 100) {
            this.data.activeStalk.messages.shift();
        }

        this.saveDB();
    }

    getLocationInfo(message) {
        if (message.guild) {
            return `🏠 Server: ${message.guild.name} | 📍 Channel: #${message.channel.name}`;
        } else if (message.channel.type === 'DM') {
            return `📱 DM with ${message.author.tag}`;
        } else if (message.channel.type === 'GROUP_DM') {
            return `👥 Group DM: ${message.channel.name || 'Unnamed Group'}`;
        }
        return '❓ Unknown location';
    }

    getStatus() {
        if (!this.isStalking || !this.data.activeStalk) {
            return {
                active: false,
                message: "🔍 **Stalk Status:** Not active"
            };
        }

        return {
            active: true,
            target: this.data.activeStalk.userTag,
            targetId: this.targetId,
            messageCount: this.data.activeStalk.messageCount,
            startTime: this.data.activeStalk.startTime,
            servers: this.data.activeStalk.servers || [],
            locations: this.data.activeStalk.locations || [],
            attachmentTypes: this.data.activeStalk.attachmentTypes || []
        };
    }

    getStalkedMessages(limit = 50) {
        if (!this.isStalking || !this.data.activeStalk) {
            return [];
        }
        return this.data.activeStalk.messages.slice(-limit);
    }

    clearStalkedMessages() {
        if (!this.isStalking) return "⚠️ No active stalk!";

        const count = this.data.activeStalk.messageCount;
        this.data.activeStalk.messages = [];
        this.data.activeStalk.messageCount = 0;
        this.data.activeStalk.servers = [];
        this.data.activeStalk.locations = [];
        this.data.activeStalk.attachmentTypes = [];
        
        this.saveDB();
        return `🗑️ Cleared ${count} stalked messages!`;
    }

    getStalkHistory() {
        // ✅ CORRECTION : Toujours retourner un objet
        return this.data.stalkHistory || {};
    }
}

const stalkManager = new StalkManager();
module.exports = { stalkManager };