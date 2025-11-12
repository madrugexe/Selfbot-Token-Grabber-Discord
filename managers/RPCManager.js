const fs = require('fs');

class RPCManager {
    constructor(filePath = './rpc.json') {
        this.filePath = filePath;
        this.data = this.loadDB();
    }

    loadDB() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(data);
            }
            console.log('📁 Creating new rpc.json file');
            return {};
        } catch (err) {
            console.error('❌ RPC DB read error:', err);
            return {};
        }
    }

    saveDB() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
        } catch (err) {
            console.error('❌ RPC DB save error:', err);
        }
    }

    getUserRPC(userId) {
        if (!this.data[userId]) {
            this.data[userId] = {
                rpctitle: "Ghost $B👻",
                appid: "",
                rpcdetails: "Join us!",
                rpcstate: ".gg/Pjudt6KtUD",
                rpctype: "LISTENING",
                twitch: "https://www.twitch.tv/.gg/Pjudt6KtUD",
                rpcminparty: 0,
                rpcmaxparty: 0,
                rpctime: null,
                rpclargeimage: "https://media.discordapp.net/attachments/1403839575792549960/1431666013090611322/800D89F1-46A9-4002-BC30-8F9763B1150C.gif?ex=68fe3e60&is=68fcece0&hm=8e5dcabc4e3fcf1d6a301db1fbd92eed7e0299a315f8272ca6a2e0b39a13c5ce&=&width=625&height=351",
                rpclargeimagetext: "Ghost $B",
                rpcsmallimage: "https://media.discordapp.net/attachments/1403839575792549960/1431752318772052028/Capture_d_ecran_2025-10-25_231153-removebg-preview.png?ex=68fe8ec1&is=68fd3d41&hm=25a5a511e857dc652d651a5fa2aa3b8f5023aa73058e8db842b398564907f0d5&=&format=webp&quality=lossless&width=669&height=584",
                rpcsmallimagetext: "👻",
                buttontext1: "",
                buttonlink1: "",
                buttontext2: "",
                buttonlink2: "",
                rpcemoji: "",
                rpconoff: true
            };
            this.saveDB();
        }
        return this.data[userId];
    }

    saveUserRPC(userId, rpcData) {
        this.data[userId] = rpcData;
        this.saveDB();
    }

    removeUserRPC(userId) {
        if (this.data[userId]) {
            delete this.data[userId];
            this.saveDB();
        }
    }

    getAllRPCs() {
        return this.data;
    }
}

module.exports = RPCManager;