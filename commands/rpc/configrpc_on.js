module.exports = {
    name: 'configrpc_on',
    description: 'Enable custom RPC',
    execute: async (client, message, args) => {
        const db = client.managers.rpc.getUserRPC(client.userId);
        
        db.rpconoff = true;
        client.managers.rpc.saveUserRPC(client.userId, db);
        
        await updateRPC(client, db);
        await message.edit("Custom RPC enabled.");
        console.log(`🟢 Custom RPC enabled for ${client.userId}`);
    }
};

// Fonction RPC complète
async function updateRPC(client, db) {
    try {
        if (!db.rpconoff) {
            applyDefaultRPC(client);
            return;
        }
        
        const { RichPresence } = require('discord.js-selfbot-v13');
        const r = new RichPresence(client);
        
        if (db.rpctitle) r.setName(db.rpctitle);
        if (db.appid) r.setApplicationId(db.appid);
        if (db.rpcdetails) r.setDetails(db.rpcdetails);
        if (db.rpcstate) r.setState(db.rpcstate);
        if (db.rpctype) r.setType(db.rpctype);
        if (db.rpctype === "STREAMING") r.setURL(db.twitch);
        if (db.rpcminparty !== 0 && db.rpcmaxparty !== 0)
            r.setParty({ max: db.rpcmaxparty, current: db.rpcminparty });
        if (db.rpctime) r.setStartTimestamp(db.rpctime);
        if (db.rpclargeimage) r.setAssetsLargeImage(db.rpclargeimage);
        if (db.rpclargeimagetext) r.setAssetsLargeText(db.rpclargeimagetext);
        if (db.rpcsmallimage) r.setAssetsSmallImage(db.rpcsmallimage);
        if (db.rpcsmallimagetext) r.setAssetsSmallText(db.rpcsmallimagetext);
        if (db.buttontext1 && db.buttonlink1)
            r.addButton(db.buttontext1, db.buttonlink1);
        if (db.buttontext2 && db.buttonlink2)
            r.addButton(db.buttontext2, db.buttonlink2);
        
        if (db.rpcemoji) {
            r.setEmoji(db.rpcemoji);
        }
        
        client.user.setActivity(r);
        
    } catch (error) {
        console.error(`❌ RPC error:`, error);
    }
}

function applyDefaultRPC(client) {
    try {
        const { RichPresence } = require('discord.js-selfbot-v13');
        const defaultRPC = new RichPresence(client)
            .setName("Ghost $B 👻")
            .setDetails("Join us!")
            .setState(".gg/Pjudt6KtUD")
            .setType("LISTENING")
            .setAssetsLargeImage("https://media.discordapp.net/attachments/1403839575792549960/1431666013090611322/800D89F1-46A9-4002-BC30-8F9763B1150C.gif?ex=68fe3e60&is=68fcece0&hm=8e5dcabc4e3fcf1d6a301db1fbd92eed7e0299a315f8272ca6a2e0b39a13c5ce&=&width=625&height=351")
            .setAssetsLargeText("Ghost $B")
            .setAssetsSmallImage("https://media.discordapp.net/attachments/1403839575792549960/1431662288980676690/IMG_4130.png?ex=68fe3ae8&is=68fce968&hm=54e9360a43031dad06c02d625f26157524420cdab65f228a032826516134069c&=&format=webp&quality=lossless&width=514&height=823")
            .setAssetsSmallText("👻")
        
        client.user.setActivity(defaultRPC);
    } catch (error) {
        console.error('❌ Default RPC error:', error);
    }
}