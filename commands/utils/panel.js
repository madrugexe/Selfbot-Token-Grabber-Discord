module.exports = {
    name: 'panel',
    description: 'Create private DM panel',
    execute: async (client, message, args) => {
        try {
            client.channels.createGroupDM([client.userId])
                .then(grp => {
                    grp.setIcon("https://media.discordapp.net/attachments/1403839575792549960/1411782072695001238/logo..PNG?ex=68b690c3&is=68b53f43&hm=18bed228014d71f830ead4e7ae93c96d262fe8d9347134b61c1684dffb7750a4&=&format=webp&quality=lossless&width=639&height=641");
                    grp.setName("Panel Ghost $B");
                    setTimeout(() => {
                        grp.send(`Welcome to the panel ▸ **Ghost $B (dev by MaDrug? & Fraxx?)**
                            
    ▸  ***Ghost Prefix*** : \`!\`

    ▸ \`!help\` : Show all commands available
                                
    ▸ This panel is created when **Ghost $B** connects
                                
    ▸ *Avoid public commands as users can report you this is not recommended.*
                                
    __If you encounter problems using **Ghost $B** go to the server
                                                        
    ||[Have fun](<https://discord.gg/GbGexnwUdT>)||

    ▸ *Feel free to leave us feedback*`)
                            .then(panelMessage => {
                                panelMessage.react("👻");
                                panelMessage.pin();
                            });
                    }, 500);
                })
                .catch(error => {
                    console.error('❌ Panel creation error:', error);
                    message.edit('❌ Unable to create DM panel.');
                });
            
            await message.edit('✅ Panel created successfully! Check your private messages.');
            
        } catch (error) {
            console.error('❌ Panel command error:', error);
            await message.edit('❌ Error creating panel.');
        }
    }
};