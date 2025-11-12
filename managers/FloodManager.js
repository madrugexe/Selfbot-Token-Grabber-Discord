class FloodManager {
    constructor(floodDBManager) {
        this.floodDBManager = floodDBManager;
        this.sequences = new Map();
        this.loadAllSequences();
    }

    loadAllSequences() {
        const allData = this.floodDBManager.getAllSequences();
        Object.entries(allData).forEach(([userId, sequence]) => {
            this.sequences.set(userId, sequence);
        });
        console.log(`📂 ${this.sequences.size} flood sequence(s) loaded from flood.json`);
    }

    saveUserSequence(userId) {
        const userSeq = this.sequences.get(userId);
        if (userSeq) {
            this.floodDBManager.saveUserSequence(userId, userSeq);
        }
    }

    setFlood(userId, num, message) {
        if (!this.sequences.has(userId)) {
            this.sequences.set(userId, {
                messages: [],
                delays: [],
                isFlooding: false
            });
        }
        const userSeq = this.sequences.get(userId);
        userSeq.messages[num] = message;
        this.saveUserSequence(userId);
        return `✅ Message ${num} set: ${message}`;
    }

    modifFlood(userId, num, message) {
        const userSeq = this.sequences.get(userId);
        if (!userSeq || !userSeq.messages[num]) {
            return `❌ Message ${num} does not exist.`;
        }
        userSeq.messages[num] = message;
        this.saveUserSequence(userId);
        return `✅ Message ${num} modified: ${message}`;
    }

    delFlood(userId, num) {
        const userSeq = this.sequences.get(userId);
        if (!userSeq || !userSeq.messages[num]) {
            return `❌ Message ${num} does not exist.`;
        }
        delete userSeq.messages[num];
        this.saveUserSequence(userId);
        return `✅ Message ${num} deleted.`;
    }

    listFlood(userId) {
        const userSeq = this.sequences.get(userId);
        if (!userSeq) return '❌ No messages set.';
        
        const messages = userSeq.messages
            .map((msg, idx) => msg ? `${idx}: ${msg}` : null)
            .filter(Boolean);
        
        return messages.length > 0 
            ? `📋 Flood messages:\n${messages.join('\n')}`
            : '❌ No messages set.';
    }

    clearFlood(userId) {
        if (this.sequences.has(userId)) {
            this.sequences.delete(userId);
            this.floodDBManager.removeUserSequence(userId);
        }
        return '✅ Flood sequence cleared.';
    }

    async startFlood(userId, channel, delay = 1000) {
        const userSeq = this.sequences.get(userId);
        if (!userSeq || userSeq.messages.filter(Boolean).length === 0) {
            return '❌ No sequence defined.';
        }

        if (userSeq.isFlooding) {
            return '❌ Flood already in progress.';
        }

        userSeq.isFlooding = true;
        const messageCount = userSeq.messages.filter(Boolean).length;
        this.saveUserSequence(userId);
        
        const executeFlood = async () => {
            try {
                for (const msg of userSeq.messages) {
                    if (!msg) continue;
                    await channel.send(msg);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                console.error('❌ Flood error:', error);
            } finally {
                userSeq.isFlooding = false;
                this.saveUserSequence(userId);
            }
        };

        executeFlood();
        return `🚀 Flood started with ${messageCount} messages (delay: ${delay}ms)`;
    }

    stopFlood(userId) {
        const userSeq = this.sequences.get(userId);
        if (userSeq && userSeq.isFlooding) {
            userSeq.isFlooding = false;
            this.saveUserSequence(userId);
            return '🛑 Flood stopped.';
        }
        return '❌ No flood in progress.';
    }

    countFlood(userId) {
        const userSeq = this.sequences.get(userId);
        const count = userSeq ? userSeq.messages.filter(Boolean).length : 0;
        return `📊 ${count} messages set.`;
    }
}

module.exports = FloodManager;